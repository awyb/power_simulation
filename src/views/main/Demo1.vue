<style scoped lang="less">
  .container { width: 100%;height: 100%;font-size:14px;
    .context-menu { position: absolute;border: 1px solid #ccc;background-color: white;list-style: none;padding: 0;margin: 0;z-index: 1000; }
    .context-menu li { display: flex;align-items: center;justify-content: space-between; padding: 10px 15px;width:200px; cursor: pointer;
      span:nth-child(2) { color: #a8a8a8;font-style: italic;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; }
    }
    .context-menu li:hover { background-color: #f0f0f0; }
    .el-icon { margin-right: 5px;}
    i { margin-right:5px; }
  }
  
</style>

<template>
   <div class="container">
    <div class="container" ref="container"></div>
    <ul v-if="contextMenuVisible" ref="rightmenu" :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px`,transform:translatecss }" class="context-menu">
      <li @click="editEdge">
        <span><el-icon><component :is="'Edit'"/></el-icon>编辑</span>
        <span></span>
      </li>
      <li @click="excute('delete')">
        <span><i class="iconfont icon-shanchu"></i>删除</span>
        <span>Delete</span>
      </li>
      <li @click="excute('cut')">
        <span><i class="iconfont icon-cut"></i>剪切</span>
        <span>Ctrl+X</span>
      </li>
      <li @click="excute('copy')">
        <span><i class="iconfont icon-copy"></i>复制</span>
        <span>Ctrl+C</span>
      </li>
      <li @click="pasteFun">
        <span><i class="iconfont icon-niantie"></i>粘贴</span>
        <span>Ctrl+V</span>
      </li>
      <li @click="excute('create')">
        <span><i class="iconfont icon-xinjian"></i>创建副本</span>
        <span>Ctrl+D</span>
      </li>
      <li @click="excute('rotateR')">
        <span><i class="iconfont icon-a-xuanzhuanmianban-rotatepanel-1"></i>顺时针旋转</span>
        <span>Ctrl+R</span>
      </li>
      <li @click="excute('rotateL')">
        <span><i class="iconfont icon-a-xuanzhuanmianban-rotatepanel-anti-1"></i>逆时针旋转</span>
        <span>Ctrl+Shift+R</span>
      </li>
      <li @click="excute('undo')">
        <span><i class="iconfont icon-undo"></i>撤销</span>
        <span>Ctrl+Z</span>
      </li>
      <li @click="excute('redo')">
        <span><i class="iconfont icon-zhongzuo"></i>重做</span>
        <span>Ctrl+Y</span>
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
import { graphEvents } from './graphEvents'
import common from '@/components/common'
import graphcom from './graph'
import { useStore } from 'vuex'
import { defineComponent, onMounted, ref, onBeforeUnmount, reactive } from 'vue'
import { ElMessage } from 'element-plus'


export default defineComponent({
  name: 'Demo1',
  props:{
    widthL: {
      type: Number,
      default: 0,
    }
  },
  setup(props, { expose, emit })
  {
    const container = ref<HTMLElement | null>(null)
    const rightmenu = ref<HTMLElement | null>(null)
    const contextMenuVisible = ref(false)
    const menuPosition = reactive({ x: 0, y: 0 })
    const toolsConfig = common.toolsConfig()
    const translatecss = ref('')
    
    let checkEdge: Edge|null, selectedCell: Cell|null, graph: Graph, excuteGraph:object|null, transform:string
    const store = useStore()
    const pageHeaderH = store.state.pageHeaderH
    
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
    const excute = (type:string)=>
    {
      if (excuteGraph)
        (excuteGraph as any)[type]()
      contextMenuVisible.value = false
    }
    const pasteFun = () =>
    {
      if (graph.isClipboardEmpty()) return
      // menuPosition
      // 计算相对偏移量
      let center = {x:0, y:0}
      if (graph&&graph.getPlugin('clipboard'))
      
        center =Object(graph.getCellsBBox(Object(graph.getPlugin('clipboard')).cells)).center

      // const t1 = graph.localToPage(graph.graphToLocal(menuPosition))
      // const t2 = graph.localToClient(graph.graphToLocal(center))
      const t1 = graph.graphToLocal({...menuPosition, x:menuPosition.x-props.widthL})
      const t2 = center
      const cells =graph.paste({ offset:{dx:t1.x-t2.x, dy:t1.y-t2.y} })
      graph.cleanSelection()
      graph.select(cells)
    }
    const bindKey = ()=>
    {
      graph.on('cell:contextmenu', ({ cell, e }) =>
      {
        if (!container.value) return
        e.preventDefault()
        const pos = graph.clientToGraph(e.clientX+props.widthL, e.clientY)
        menuPosition.x = pos.x
        menuPosition.y = pos.y
        translatecss.value = `translate(${window.innerWidth-e.clientX<=store.state.rmenuBoxW?'-100%':'0'},${container.value.offsetHeight-e.clientY+pageHeaderH<(rightmenu&&rightmenu.value?rightmenu.value.offsetHeight:store.state.rmenuBoxH)?'-100%':'0'})`

        selectedCell = cell
        contextMenuVisible.value = true
      })
      graph.on('blank:contextmenu', ({ e }) =>
      {
        if (!container.value) return
        e.preventDefault()
        const pos = graph.clientToGraph(e.clientX+props.widthL, e.clientY)
        menuPosition.x = pos.x
        menuPosition.y = pos.y

        translatecss.value = `translate(${window.innerWidth-e.clientX<=232?'-100%':'0'},${container.value.offsetHeight-e.clientY+pageHeaderH<(rightmenu&&rightmenu.value?rightmenu.value.offsetHeight:400)?'-100%':'0'})`
        // 屏幕宽度:window.screen.width
        // 浏览器窗口宽度:window.innerWidth e.clientX
        // container.value.offsetHeight
       
        contextMenuVisible.value = true
      })
      graph.on('edge:connected', (args) =>
      {
        // args.edge.prop('target/anchor', {name:'length', args:{length:100}})
        // args.edge.prop('target/anchor', {name:'orth'})
        // console.log(args)
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
      graph.on('cell:mouseleave', ({e, cell }) =>
      {
        if (cell.isEdge())
        {
          cell.hasTool('vertices')&&cell.removeTool('vertices')
          cell.hasTool('segments')&&cell.removeTool('segments')
        }
        if (cell.isNode())
          graphcom.showPorts('hidden', graph)
        
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
          graphcom.addTools(cell, ['vertices', 'segments', 'boundary', 'source-arrowhead', 'target-arrowhead'], toolsConfig)
        }
        emit('accept-data', {data:cell.toJSON(), type:cell.isEdge()?'edge':'node'})
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
        graphcom.showPorts('hidden', graph)
        emit('accept-data', {type:'blank'})
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
      // const nodes = common.getNodes()
      // const gNodes: Node<Node.Properties>[] | { id: string }[] = []
      // nodes.slice(0, 3).forEach(node=>
      // {
      //   gNodes.push(graph.addNode(Object(node)))
      // })
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
        // // 连接桩样式 -- 高亮
        // highlighting: {
        //   magnetAvailable: {
        //     name: 'stroke',
        //     args: {
        //       padding: 0.1,
        //       attrs: {
        //         strokeWidth: 0.1,
        //         stroke: '#1684FC99',
        //       },
        //     },
        //   },
        // },
        connecting: {
          edgeAnchor:{name:'orth'},
          allowEdge: true,
          // 设置连接点
          allowBlank: false,  // 不允许连接到空白处
          // allowMulti: 'withPort',  // 允许多个连接到同一个节点，但不同的端口
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
                  targetMarker:{ tagName: 'circle', r: 2, cx: -1, },
                  sourceMarker:{ tagName: 'circle', r: 2, cx: -1, },
                  stroke: '#000000',
                  strokeWidth:2,
                 
                  // targetMarker:null
                },
              },
              tools:[toolsConfig.segments, toolsConfig.vertices],
              manualConnection: true // 手动连接
            })
          },
          validateConnection(args)
          {
            console.log(args)
            
            return Boolean(args.sourcePort!==args.targetPort&&(args.targetView?.isEdgeView()||args.targetMagnet))
            // return Boolean(targetView?.isEdgeView()||targetMagnet?.getAttribute('port-group')||sourceMagnet?.getAttribute('port-group'))
            // if (targetMagnet && targetMagnet.getAttribute('port-group'))
            //   return true
            // return false
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
      graphcom.bindKey(graph, ['copy', 'cut', 'paste', 'undo', 'redo', 'delete', 'selectall', 'create', 'rotateR', 'rotateL'])
      excuteGraph = new graphEvents(graph)
      
    }
    onMounted(() =>
    {
      renderGraph()
      bindKey()
      loadDefNode()
   
    })
  
    onBeforeUnmount(() =>
    {
      document.removeEventListener('click', () =>contextMenuVisible.value = false)
      if (graph)
        graph.dispose()
    })

    expose({ dragEnd })

    return {
      container,
      rightmenu,
      contextMenuVisible,
      menuPosition,
      editEdge,
      dragEnd,
      excute,
      pasteFun,
      translatecss
    }
  }
})

</script>