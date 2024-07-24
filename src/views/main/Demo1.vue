<style scoped lang="less">
  .container { width: 100%;height: 100%;
    .context-menu { position: absolute;border: 1px solid #ccc;background-color: white;list-style: none;padding: 0;margin: 0;z-index: 1000; }
    .context-menu li { display: flex;align-items: center;padding: 10px 15px;cursor: pointer; }
    .context-menu li:hover { background-color: #f0f0f0; }
    .el-icon { margin-right: 5px;}
  }
  
</style>

<template>
   <div class="container">
    <div class="container" ref="container"></div>
    <ul v-if="contextMenuVisible" :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }" class="context-menu">
      <li @click="editEdge">
        <el-icon><component :is="'Edit'"/></el-icon>编辑
      </li>
      <li @click="deleteEdge">
        <el-icon><component :is="'Delete'"/></el-icon>删除
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Graph, Shape, Cell, Node, Edge } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import common from '@/components/common'
import graphcom from './graph'
import { defineComponent, onMounted, ref, onBeforeUnmount, reactive } from 'vue'

export default defineComponent({
  name: 'Demo1',
  setup(_, { expose, emit })
  {
    const container = ref<HTMLElement | null>(null)
    const contextMenuVisible = ref(false)
    const menuPosition = reactive({ x: 0, y: 0 })
    const toolsConfig = common.toolsConfig()
    let checkEdge: Edge|null = null
    let selectedCell: Cell
    let graph: Graph
    // 拖拽结束,渲染到画布上
    const dragEnd = (x:number, y:number, config:object)=>
    {
      if (!container.value) return

      const n = Object(config)
      const p = graph.pageToLocal(x, y)
      const [X, Y] = [p.x - n.width/2, p.y - n.height/2]
      // 添加节点到画布
      graph.addNode(Object({...n, x:X, y:Y}))
    }
    const editEdge = () =>
    {
      if (selectedCell)
      {
        // 编辑操作逻辑，例如弹出编辑对话框
        console.log('Edit edge', selectedCell)
      }
      contextMenuVisible.value = false
    }
    const deleteEdge = () =>
    {
      if (selectedCell)
        selectedCell.remove()
      contextMenuVisible.value = false
    }

    const bindKey = ()=>
    {
      graph.on('cell:contextmenu', ({ cell, e }) =>
      {
        if (!container.value) return
        e.preventDefault()
        const pos = graph.clientToGraph(e.clientX, e.clientY)
        menuPosition.x = pos.x
        menuPosition.y = pos.y
        
        selectedCell = cell
        contextMenuVisible.value = true
      })
      graph.on('edge:connected', ({ isNew, edge }) =>
      {
        // edge.getTargetPoint().adhereToRect({
        //   x: edge.getTargetPoint().x,
        //   y: edge.getTargetPoint().y,
        //   width: 100,
        //   height: 100
        // })
      })
      // 监听连线的 mouseenter 和 mouseleave 事件
      graph.on('edge:added', ({ edge }) =>
      {
        console.log(edge)
        if (edge.getProp('manualConnection'))
          graphcom.showPorts('visible', graph)
        if (!edge.isEdge()) return
        if (edge && edge.attrs && edge.attrs.line)
        {
          console.log(edge)
          const { connectionPoints } = edge.attrs.line
          if (connectionPoints&& Array.isArray(connectionPoints))
          {
            connectionPoints.forEach((point: { x: number; y: number }) =>
            {
              const circle = new Shape.Circle({
                position: { x: point.x - 5, y: point.y - 5 },
                size: { width: 10, height: 10 },
                attrs: {
                  body: {
                    fill: '#ff0000',
                    stroke: '#ff0000',
                  },
                },
              })
              graph?.addNode(circle)
            })
          }
        }
       
      })
      
      
      graph.on('cell:mouseleave', ({ cell }) =>
      {
        graphcom.showPorts('hidden', graph)
        if (cell.isEdge())
        {
          cell.hasTool('vertices')&&cell.removeTool('vertices')
          cell.hasTool('segments')&&cell.removeTool('segments')
        }
      })
      // 控制连接桩显示/隐藏
      graph.on('cell:mouseenter', ({ cell }) =>
      {
        if (cell.isNode())
        {
          cell.getPorts().forEach(port =>
          {
            if (port.group!=='inline')
              cell.portProp(port.id+'', 'attrs/circle/style/visibility', 'visible')
          })
        }
        else if (checkEdge&&cell.isEdge())
          graphcom.addTools(checkEdge, ['vertices', 'segments'], toolsConfig)
      })
      // 监听边的选中事件
      graph.on('cell:selected', ({ cell }) =>
      {
        if (cell.isEdge())
        {
          checkEdge = cell
          graphcom.addTools(cell, ['vertices', 'segments', 'boundary'], toolsConfig)
        }
        emit('accept-data', {data:cell.toJSON()})
      })
      
      // 监听边的取消选中事件
      graph.on('cell:unselected', ({ cell }) =>
      {
        if (cell.isEdge())
        {
          checkEdge = null
          cell.removeTools()
        }
      })
      graph.on('blank:click', ()=>
      {
        if (checkEdge)
        {
          checkEdge.removeTools()
          checkEdge = null
        }
      })
      // 手动新增连接桩
      // graph.on('node:click', ({e, node}) =>
      // {
      //   const nodePosition = node.position()
      //   const local = graph.pageToLocal(e.clientX, e.clientY)
      //   const size = node.size()
      //   const position = [local.x - nodePosition.x, local.y - nodePosition.y]
      //   console.log('相对于节点的坐标:', position)
      //   node.addPort({group: 'in', args:{x: position[0]/size.width, y: position[1]/size.height, }})
        
      // })
      // 点击其他地方隐藏菜单
      document.addEventListener('click', ()=>
      {
        contextMenuVisible.value = false
      })
    }
    const loadDefNode = ()=>
    {
      const nodes = common.getNodes()
      const gNodes: Node<Node.Properties>[] | { id: string }[] = []
      nodes.slice(0, 3).forEach(node=>
      {
        gNodes.push(graph.addNode(Object(node)))
      })

      if (nodes.length>=2)
      {
        graph.addEdge({
          source:{cell:gNodes[0].id+'', port:'out1_1'},
          target:{cell:gNodes[1].id+'', port:'in2_2'},
          router: {
            name: 'orth'
          },
          tools:[toolsConfig.segments, toolsConfig.vertices],
          manualConnection: false, // 手动连接
          attrs: {
            line: {
              stroke: '#000000',
              targetMarker:null
            },
          },
        })
      }
    }
    const renderGraph = ()=>
    {
      if (!container.value) return
      
      graph = new Graph({
        container: container.value,
        background:
        {
          color: '#F2F7FA',
        },
        panning: {
          enabled: true,
          modifiers: 'ctrl'
        },
        mousewheel: {
          enabled: true,
          modifiers: 'Ctrl',
          maxScale: 4,
          minScale: 0.2,
        },
        grid:
        {
          visible: true,
          type: 'doubleMesh',
          args: [
            {
              color: '#eee', // 主网格线颜色
              thickness: 1, // 主网格线宽度
            },
            {
              color: '#ddd', // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4, // 主次网格线间隔
            },
          ]
        },
        connecting: {
          allowEdge: true,
          // 设置连接点
          allowBlank: false,  // 不允许连接到空白处
          allowMulti: 'withPort',  // 允许多个连接到同一个节点，但不同的端口
          // allowLoop: false,  // 不允许连接回自身
          highlight: true,  // 在拖动连接时高亮显示连接点
          // connector: 'smooth',  // 设置连接器的样式
          connectionPoint: 'anchor',  // 设置连接点样式
          anchor: 'center',  // 设置锚点在中心
          
          connector: {
            name: 'jumpover',
            args: {
              type: 'arc',
              size: 5,
              radius: 0,
            },
          },
          router: {
            name: 'orth',
            args: {
              padding: 5,
            },
          },
          createEdge()
          {
            return new Shape.Edge({
              attrs: {
                line: {
                  // targetMarker:'circle',
                  stroke: '#000000',
                  strokeWidth:2,
                  targetMarker:null
                },
              },
              tools:[toolsConfig.segments, toolsConfig.vertices],
              manualConnection: true // 手动连接
            })
          },
          validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet })
          {
            return true
            // 自定义连接验证逻辑
            // if (targetMagnet&&sourceMagnet && targetMagnet.getAttribute('port-group') === 'in'&& sourceMagnet.getAttribute('port-group') === 'out')
            //   return true  // 仅允许连接到输入端口
            // return false  // 否则不允许连接
          },
        },
      })
      // #region 使用插件
      graph
        .use(new Transform({
          resizing: {
            enabled: true,
            minWidth: 20,
            maxWidth: 400,
            orthogonal: false,
            restrict: false,
            preserveAspectRatio:true
          },
          rotating: true,
          
        }),
        )
        .use(new Selection({
          enabled: true,
          multiple: true,
          rubberband: true,
          movable: true,
          showNodeSelectionBox: true,
        }),
        )
        .use(new Snapline())
        .use(new Keyboard())
        .use(new Clipboard())
        .use(new History({
          enabled: true,
          beforeAddCommand:(type, data)=>
          {
            const nIncludes=['ports', 'tools']
            if (nIncludes.includes(Object(data).key))
              return false
            return true
          }
        }))
      graphcom.bindKey(graph, ['copy', 'cut', 'paste', 'undo', 'redo', 'delete', 'selectall'])
    }
    
    onMounted(() =>
    {
      renderGraph()
      bindKey()
      loadDefNode()
      document.removeEventListener('click', () =>contextMenuVisible.value = false)
    })
    
    onBeforeUnmount(() =>
    {
      document.removeEventListener('click', () =>contextMenuVisible.value = false)
      graph.dispose()
    })

    expose({ dragEnd })

    return {
      container,
      contextMenuVisible,
      menuPosition,
      editEdge,
      deleteEdge,
      dragEnd
    }
  }
})

</script>