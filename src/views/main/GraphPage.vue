<style scoped lang="less">
  .container { width: 100%;height: 100%;
    .context-menu { position: absolute;border: 1px solid #ccc;background-color: white;list-style: none;padding: 0;margin: 0;z-index: 1000;font-size:14px; }
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
  </div>
</template>

<script lang="ts">
import { Graph, Shape, Cell, Edge } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Scroller } from '@antv/x6-plugin-scroller'
import { useStore } from 'vuex'
import { defineComponent, onMounted, ref, onBeforeUnmount, reactive, h, onActivated, onDeactivated, watch} from 'vue'
import { ElNotification } from 'element-plus'

import { graphEvents } from './graphEvents'
import common from '@/components/ts/common'
import graphcom from './graph'
import eveBus from '@/components/ts/eveBus'
import { findStore } from '@/indexedDB'
import { createIndexedDB } from '@/views/main/init'

import { RightMenu } from '@/components/interface/interfaceBase'
import { query } from '@/request'
let changeProject = false
export default defineComponent({
  name: 'GraphPage',
  props: {
    projectId: {
      type:Number
    }
  },
  setup(props, { expose, emit })
  {
    const container = ref<HTMLElement | null>(null)
    const menuPosition = reactive({ x: 0, y: 0 })
    const toolsConfig = common.toolsConfig()
    const menus = ref<RightMenu[]>([
      {
        name: 'edit',
        namec: '编辑',
        icon: 'iconfont icon-edit',
        keybord: '',
        click: () =>
        {
          editEdge()
        },
      },
      {
        name: 'delete',
        namec: '删除',
        icon: 'iconfont icon-shanchu',
        keybord: 'Delete',
        click: () =>
        {
          excute('delete')
        },
      },
      {
        name: 'cut',
        namec: '剪切',
        icon: 'iconfont icon-cut',
        keybord: 'Ctrl+X',
        click: () =>
        {
          excute('cut')
        },
      },
      {
        name: 'copy',
        namec: '复制',
        icon: 'iconfont icon-copy',
        keybord: 'Ctrl+C',
        click: () =>
        {
          excute('copy')
        },
      },
      {
        name: 'stick',
        namec: '粘贴',
        icon: 'iconfont icon-niantie',
        keybord: 'Ctrl+V',
        click: () =>
        {
          pasteFun()
        },
      },
      {
        name: 'create',
        namec: '创建副本',
        icon: 'iconfont icon-xinjian',
        keybord: 'Ctrl+D',
        click: () =>
        {
          excute('create')
        },
      },
      {
        name: 'rotateR',
        namec: '顺时针旋转',
        icon: 'iconfont icon-a-xuanzhuanmianban-rotatepanel-1',
        keybord: 'Ctrl+R',
        click: () =>
        {
          excute('rotateR')
        },
      },
      {
        name: 'rotateL',
        namec: '逆时针旋转',
        icon: 'iconfont icon-a-xuanzhuanmianban-rotatepanel-anti-1',
        keybord: 'Ctrl+Shift+R',
        click: () =>
        {
          excute('rotateL')
        },
      },
      {
        name: 'undo',
        namec: '撤销',
        icon: 'iconfont icon-undo',
        keybord: 'Ctrl+Z',
        click: () =>
        {
          excute('undo')
        },
      },
      {
        name: 'redo',
        namec: '重做',
        icon: 'iconfont icon-zhongzuo',
        keybord: 'Ctrl+Y',
        click: () =>
        {
          excute('redo')
        },
      }])
    let checkEdge: Edge | null, selectedCell: Cell | null, graph: Graph, excuteGraph: object | null, scroller: Scroller | null, scrollPosition: { left: number, top: number } | null
    let [gridColor, showLabel, showPortLabel, dragPage] = ['#ddd', 'none', 'none', false]
    const store = useStore()

    // 拖拽结束,渲染到画布上
    const dragEnd = (x: number, y: number, node: object) =>
    {
      if (!container.value) return
      const n = Object(node)
      const p = graph.pageToLocal(x, y)
      const [X, Y] = [p.x - n.width / 2, p.y - n.height / 2]
      // 添加节点到画布
      const sameNode = graph.getNodes().filter(node => node.data.id === n.data.id)
      n.data.prjnodeInfo = {
        name: n.data.keyname + '#' + (sameNode.length + 1),
        namec: n.data.namec + '#' + (sameNode.length + 1),
      }
      n.data.func_memory = []
      n.label = n.data.prjnodeInfo.namec
      const _node = graph.addNode(Object({ ...n, x: X, y: Y }))
      _node.attr('label/display', showLabel)
      _node.getPorts().forEach(port =>
      {
        _node.portProp(port.id + '', 'attrs/text/display', showPortLabel)
      })
    }
    const editEdge = () =>
    {
      if (selectedCell)
      {
        // 编辑操作逻辑，例如弹出编辑对话框
        console.log('Edit edge', selectedCell)
      }
    }
    const excute = (type: string) =>
    {
      if (excuteGraph)
        (excuteGraph as any)[type]()
    }
    const pasteFun = () =>
    {
      if (graph.isClipboardEmpty()) return
      // menuPosition
      // 计算相对偏移量
      let center = { x: 0, y: 0 }
      if (graph && graph.getPlugin('clipboard'))
        center = Object(graph.getCellsBBox(Object(graph.getPlugin('clipboard')).cells.filter((n: { isNode: () => any }) => n.isNode()))).center
      const t1 = graph.clientToLocal({ ...menuPosition, y: menuPosition.y })
      const t2 = center
      const cells = graph.paste({ offset: { dx: t1.x - t2.x, dy: t1.y - t2.y } })
      graph.cleanSelection()
      graph.select(cells)
    }
    const bindKey = () =>
    {
      graph.on('cell:contextmenu', ({ cell, e }) =>
      {
        if (!container.value) return
        menuPosition.x = e.clientX
        menuPosition.y = e.clientY
        graph.select(cell)
        eveBus.emit('right-menu', { e, menus: menus.value, data: {} })
      })
      graph.on('blank:contextmenu', ({ e }) =>
      {
        if (!container.value) return
        menuPosition.x = e.clientX
        menuPosition.y = e.clientY
        // 屏幕宽度:window.screen.width
        // 浏览器窗口宽度:window.innerWidth e.clientX
        // container.value.offsetHeight
        eveBus.emit('right-menu', { e, menus: menus.value, data: {} })
      })
      graph.on('edge:connected', async(args) =>
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
        const source = args.edge.getSourceCell()
        const target = args.edge.getTargetCell()
        const sourcePortId = args.edge.getSourcePortId()
        const targetPortId = args.edge.getTargetPortId()
        
        if (source && target)
        {
          if (sourcePortId && targetPortId)
          {
            const sourcePort = (source as any).getPort(sourcePortId)
            const targetPort = (target as any).getPort(targetPortId)
            if (getPortDimension(sourcePort) && getPortDimension(targetPort) && getPortDimension(sourcePort) !== getPortDimension(targetPort))
            {
              ElNotification({
                title: '连接失败',
                position: 'bottom-right',
                message: `引脚 X 维度不相等，首端维度 ${getPortDimension(sourcePort)}，末端维度 ${getPortDimension(targetPort)}`,
                showClose: true,
                icon: h('i', { class: 'iconfont icon-jinggao', style: 'color:#faad14;' }, ''),
                duration: 20000,
                customClass: 'msg-warning'
              })
              args.edge.remove()
              return
            }
          }
          const edges = graph.getEdges()
          args.edge.data = {
            name: 'edge#' + edges.length,
            namec: '连接线#' + edges.length,
            prjid: props.projectId,
            source: args.edge.source,
            target: args.edge.target,
            cellkey: args.edge.id,
            vertices: args.edge.vertices,
            format: {
            }
          }
          store.dispatch('savePage/addExcute', {
            type: 'add', tabname: 'project_edges', index: args.edge.id,
            args: args.edge.data
          })
        }
      })

      graph.on('cell:removed', ({ cell, index, options }) =>
      {
        if (!changeProject&&cell.data)
        {
          eveBus.emit('node-delete', { cellid: cell.data.id })
          store.dispatch('savePage/addExcute', {
            type: 'delete', tabname: cell.isNode() ? 'project_nodes' : 'project_edges', index:cell.id,
            args:
            {
              id: cell.isNode()?cell.data.prjnodeInfo.id:cell.data.id
            }
          })
        }
      })
      graph.on('node:added', ({ node, index, options }) =>
      {
        if (node.getProp('copy')||!node.getProp('autoConnection'))
        {
          eveBus.emit('node-add', {cellid:node.getData().id})
          node.data.prjnodeInfo = {
            ...node.data.prjnodeInfo,
            id: node.id,
            prjid: props.projectId,
            cellid: node.getData().id,
            format: {...node.getPosition(), angle: node.getAngle()},
            attribute:{},
            params:{},
            pin:{},
            cellkey:node.id,
          }
          store.dispatch('savePage/addExcute', {
            type: 'add', tabname: 'project_nodes', index: node.id,
            args: node.data.prjnodeInfo
          })
        }
      })
      // 监听连线的 mouseenter 和 mouseleave 事件
      graph.on('edge:added', ({ edge }) =>
      {
        if (!edge.getProp('autoConnection'))
          graphcom.showPorts('visible', graph)
        if (edge && edge.attrs && edge.attrs.line)
        {
          const { connectionPoints } = edge.attrs.line
          if (connectionPoints && Array.isArray(connectionPoints))
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
        if (cell.isEdge())
        {
          cell.hasTool('vertices') && cell.removeTool('vertices')
          cell.hasTool('segments') && cell.removeTool('segments')
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
            if (port.group !== 'inline')
              cell.portProp(port.id + '', 'attrs/circle/style/visibility', 'visible')
          })
        }
        else if (checkEdge && cell.isEdge())
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
        emit('accept-data', { cell: cell, type: cell.isEdge() ? 'edge' : 'node' })
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
      graph.on('blank:click', () =>
      {
        if (checkEdge)
        {
          checkEdge.removeTools()
          checkEdge = null
        }
        graphcom.showPorts('hidden', graph)
        emit('accept-data', { type: 'blank' })
      })
      graph.on('node:change:*', (args) => // 监听结点发生变化
      {
        if (args.key !== 'ports')
        {
          if (args.key === 'position' || args.key === 'angle')
          {
            const oformat = JSON.parse(JSON.stringify(args.cell.data.prjnodeInfo.format))
            const format = { ...oformat, ...(args.key === 'position' ? args.current : { angle: args.current }) }
            store.dispatch('savePage/addExcute', {
              type: 'update', index: args.cell.id, tabname: 'project_nodes',
              args: {
                id: args.cell.data.prjnodeInfo.id,
                format
              },
              onCancle: () =>
              {
                args.cell.data.prjnodeInfo = { ...args.cell.data.prjnodeInfo, format: oformat }
              }
            })
            args.cell.data.prjnodeInfo = { ...args.cell.data.prjnodeInfo, format }
          }
        }
      })
      graph.on('edge:change:source', () =>
      {
        graphcom.showPorts('visible', graph)
      })
      graph.on('edge:change:target', () =>
      {
        graphcom.showPorts('visible', graph)
      })
      graph.on('edge:change:vertices', (args) => // 监听边发生变化发生变化
      {
        const overtices = JSON.parse(JSON.stringify(args.cell.data.format))
        store.dispatch('savePage/addExcute', {
          type: 'update', index: args.cell.id, tabname: 'project_edges',
          args: {
            id: args.cell.data.id,
            vertices: args.current,
          },
          onCancle: () =>
          {
            args.cell.data = { ...args.cell.data, vertices: overtices }
          }
        })
        args.cell.data = {...args.cell.data, vertices:args.current}
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
      document.addEventListener('keydown', (event: KeyboardEvent) =>
      {
        if ((event.ctrlKey || event.key === 'Control') && dragPage)
        {
          graph.toggleRubberband(true)
          const plugin = Object(graph.getPlugin('scroller'))
          plugin.disablePanning()
        }
      })
      document.addEventListener('keyup', (event: KeyboardEvent) =>
      {
        if ((event.ctrlKey || event.key === 'Control') && dragPage)
        {
          graph.toggleRubberband(false)
          const plugin = Object(graph.getPlugin('scroller'))
          plugin.enablePanning()
        }
      })
    }
    const loadDefNode = () =>
    {
      Promise.all([
        query({ tabname: 'project_nodes', exp: `prjid = ${props.projectId}` }),
        query({ tabname: 'project_edges', exp: `prjid = ${props.projectId}` }),
        query({ tabname: 'func_memory', exp: `prjid = ${props.projectId}` })])
        .then(async ret =>
        {
          const func_memory = ret[2].status === 200 ? ret[2].data : []
          if (ret[0].data && ret[0].data.length)
          {
            const nodes = await common._getNodes()
            ret[0].data.forEach((n: any) =>
            {
              const node = nodes.find((node: any) => node.data.id === n.cellid)
              if (node)
              {
                const pin = n.pin ? JSON.parse(n.pin) : {}
                const newNode = graph.addNode({
                  ...node, ...JSON.parse(n.format),
                  label: n.namec,
                  id: n.cellkey,
                  autoConnection: true,
                  data: {
                    ...node.data,
                    func_memory: func_memory.filter((i:any)=>i.cellkey=== n.cellkey),
                    prjnodeInfo: {
                      ...n,
                      params: n.params ? JSON.parse(n.params) : {},
                      format: n.format ? JSON.parse(n.format) : {},
                      attribute: n.attribute ? JSON.parse(n.attribute) : {},
                      pin
                    }
                  }
                })
                node.data.ports.forEach((port: any) =>
                {
                  if (pin[port.name])
                    newNode.setPortProp(port.id + '', 'attrs/text/text', pin[port.name])
                })
              }
            })
            ret[1].data.forEach((edge: any) =>
            {
              graph.addEdge({
                attrs: {
                  line: {
                    targetMarker: { tagName: 'circle', r: 2, cx: -1, },
                    sourceMarker: { tagName: 'circle', r: 2, cx: -1, },
                    stroke: '#000000',
                    strokeWidth: 2,
                  },
                },
                id: edge.cellkey,
                namec: edge.namec,
                autoConnection: true, // 自动连接接
                source: JSON.parse(edge.source),
                vertices: edge.vertices ? JSON.parse(edge.vertices) : [],
                target: JSON.parse(edge.target),
                data: {
                  ...edge,
                  source: JSON.parse(edge.source),
                  vertices: edge.vertices ? JSON.parse(edge.vertices) : [],
                  target: JSON.parse(edge.target),
                  format:JSON.parse(edge.format)
                },
                ...JSON.parse(edge.format),
              })
            })
          }

        })
    }
    const getPortDimension = (port: any) =>
    {
      if (port&&port.dimension)
        return Number(port.dimension.split('×').length?port.dimension.split('x')[0]:0)
      return 0
    }
    const renderGraph = () =>
    {
      if (!container.value) return

      graph = new Graph({
        container: container.value,
        interacting: function(cellView)
        {
          return !dragPage
        },
        autoResize: true,
        // width: 800, // 画布宽度
        // height: 600, // 画布高度
        background:
        {
          color: '#ffffff',
        },
        // panning: {
        //   enabled: true,
        //   modifiers: 'ctrl'
        // },
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
              color: gridColor, // 主网格线颜色
              thickness: 1, // 主网格线宽度
            },
            {
              color: gridColor, // 次网格线颜色
              thickness: 2, // 次网格线宽度
              factor: 16, // 主次网格线间隔
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
          edgeAnchor: { name: 'orth' },
          allowEdge: true,
          // 设置连接点
          allowBlank: false,  // 不允许连接到空白处
          // allowMulti: 'withPort',  // 允许多个连接到同一个节点，但不同的端口
          allowLoop: false,  // 不允许连接回自身
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
                  targetMarker: { tagName: 'circle', r: 2, cx: -1, },
                  sourceMarker: { tagName: 'circle', r: 2, cx: -1, },
                  stroke: '#000000',
                  strokeWidth: 2,
                  // targetMarker:null
                },
              },
              tools: [toolsConfig.segments, toolsConfig.vertices],
              autoConnection: false // 自动连接
            })
          },
          validateConnection(args)
          {
            // if (getPortDimension(args.sourceCell) && getPortDimension(args.targetCell))
            //   return getPortDimension(args.sourceCell) === getPortDimension(args.targetCell)
            // if (args.targetCell?.isNode() && args.sourceCell?.isNode())
            // {

            // }
            if (args.targetCell?.isNode() && !args.targetPort || args.sourceCell?.isNode() && !args.sourcePort)
              return false
            if (args.targetCell?.id === args.sourceCell?.id)
              return Boolean(args.sourcePort !== args.targetPort)
            return Boolean(args.targetView?.isEdgeView() || args.targetMagnet)
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
      scroller = new Scroller({
        enabled: true,
        pageBreak: true,
        pageVisible: true,
        pannable: true,
        modifiers: 'ctrl',
        pageHeight: 801,
        pageWidth: 961,
        // padding:200
      })
      graph
        .use(new Transform({
          resizing: {
            enabled: true,
            minWidth: 20,
            maxWidth: 400,
            orthogonal: false,
            restrict: false,
            preserveAspectRatio: true
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
        .use(new Snapline({
          enabled: true,
        }))
        .use(new Keyboard())
        .use(new Clipboard())
        .use(new History({
          enabled: true,
          beforeAddCommand: (type, data) =>
          {
            const nIncludes = ['ports', 'tools']
            if (nIncludes.includes(Object(data).key))
              return false
            return true
          }
        }))
        .use(scroller)
      graph.zoomTo(0.8)
      graphcom.bindKey(graph, ['copy', 'cut', 'paste', 'undo', 'redo', 'delete', 'selectall', 'create', 'rotateR', 'rotateL'])
      excuteGraph = new graphEvents(graph)
      eveBus.on('change-graph-config', (data) =>
      {
        if (graph && data)
          // graph.drawBackground(data as Graph.BackgroundManager.Options)
          graph.container.style.background = (data as any).color

      })
      eveBus.on('graph-location', (data) =>
      {
        const circle = graph.getCellById((data as any).cellkey)
        if (circle)
        {
          graph.centerCell(circle)
          graph.cleanSelection()
          graph.select(circle)
        }
          
        
      })
      eveBus.on('change-graph-grid', (data) =>
      {
        if (graph && data)
        {
          graph.showGrid()
          switch ((data as any).type)
          {
          case 'hidden':
            graph.hideGrid()
            break
          case 'dot':
            graph.drawGrid({ type: 'dot', args: [{ color: gridColor }] })
            break
          case 'mesh':
            graph.drawGrid({ type: 'mesh', args: [{ color: gridColor }] })
            break
          case 'doubleMesh':
            graph.drawGrid({
              type: 'doubleMesh', args: [
                {
                  color: gridColor, // 主网格线颜色
                  thickness: 1, // 主网格线宽度
                },
                {
                  color: gridColor, // 次网格线颜色
                  thickness: 2, // 次网格线宽度
                  factor: 16, // 主次网格线间隔
                },
              ]
            })
          }
        }
      })
      eveBus.on('change-grid-color', (data) =>
      {
        if (graph && data)
        {
          const grid = graph.options.grid
          gridColor = (data as any).color
          if (grid.args && Array.isArray(grid.args))
            graph.drawGrid({ ...(grid as any), args: grid.args.map(arg => ({ ...arg, color: gridColor, thickness: arg.thickness || 1 })) })
        }
      })
      eveBus.on('show-page-split', (show) =>
      {

        if (scroller)
        {
          const plugin = Object(graph.getPlugin('scroller'))
          plugin.scrollerImpl.options.pageBreak = show
          plugin.scrollerImpl.updatePageBreak()
        }
      })
      eveBus.on('drag-graph-page', (isDrag) =>
      {
        dragPage = Boolean(isDrag)
        graph.toggleRubberband(!!!isDrag)
        const plugin = Object(graph.getPlugin('scroller'))
        plugin.options.modifiers = isDrag ? null : 'ctrl'
      })
      eveBus.on('show-cell-label', (show) =>
      {
        showLabel = show ? 'block' : 'none'
        const nodes = graph.getNodes()
        nodes.forEach(node =>
        {
          node.attr('label/display', showLabel)
        })
      })
      eveBus.on('show-port-label', (show) =>
      {
        showPortLabel = show ? 'block' : 'none'
        const nodes = graph.getNodes()
        nodes.forEach(node =>
        {
          node.getPorts().forEach(port =>
          {
            node.portProp(port.id + '', 'attrs/text/display', showPortLabel)
          })
        })
      })
      eveBus.on('graph-export-toJson', async() =>
      {
        // const json = JSON.stringify(graph)
        // const data = new Blob([json], { type: 'application/json' })
        // const url = URL.createObjectURL(data)
        // const a = document.createElement('a')
        // a.href = url
        // a.download = 'graph.json'
        // document.body.appendChild(a)
        // a.click()
        // document.body.removeChild(a)
        let defParams:any = []
        const db = await createIndexedDB('power_sys')
        if (db)
          defParams = await findStore(db as IDBDatabase, 'node_params')
        const cells = graph.toJSON().cells
        const nodes = cells.filter(cell => cell.shape !== 'edge')
        const edges = cells.filter(cell => cell.shape === 'edge')
        const cellsJson:any = []
        nodes.forEach(node =>
        {
          const data = node.data
          const params = data.prjnodeInfo.params
          const pin = data.prjnodeInfo.pin
          const nodeParams = defParams.filter((item: any) => item.nodename === data.name)
          nodeParams.forEach((item: any) =>
          {
            if (item.defval)
            {
              if ((params[item.classify] && params[item.classify][item.name] === undefined)||!params[item.classify])
              {
                if (params[item.classify])
                  params[item.classify][item.name] = item.defval
                else
                  params[item.classify] = { [item.name]: item.defval }
              }
            }
          })
          cellsJson.push({ id: node.id, type: 'node', keyname: data.keyname, name: data.name, namec: data.namec, params, pin })
        })
        edges.forEach(edge =>
        {
          cellsJson.push({id:edge.id, type:'edge', source:edge.source, target:edge.target})
        })
        console.log(nodes, edges, cellsJson)
      })
      eveBus.on('graph-import-toJson', async() =>
      {
        const comp = await import('@/components/Upload.vue').then(module => module.default)
        store.dispatch('changeUrl',
          {
            comp,
            id: Math.random(),
            title: '数据导入',
            onOk: (att: any) =>
            {
              const ojson = graph.toJSON()
              const njson = JSON.parse(att)
              const json = { cells: [...ojson.cells, ...njson.cells] }
              graph.fromJSON(json)
            }
          })
      })
      eveBus.on('graph-update-port-label', (params: any) =>
      {
        const node = graph.getCellById(params.cellid)
        if (node.isNode() && node.setPortProp instanceof Function&&params.type!=='inline')
          node.setPortProp(params.portid + '', 'attrs/text/text', params.conn)
      })

    }
    async function loadSvg(url: string)
    {
      const response = await fetch(url)
      const svgText = await response.text()
      return svgText
    }
    watch(() => props.projectId, () =>
    {
      if (graph)
      {
        changeProject = true
        graph.clearCells()
        changeProject = false
      }
      loadDefNode()
    })
    onMounted(async() =>
    {
      renderGraph()
      bindKey()
      loadDefNode()
      // 自定义 SVG 形状
      Shape.HTML.register({
        shape: 'custom-svg',
        width: 100,
        height: 100,
        html: function(options: any)
        {
          return options.getProp('svg')
        },
      })
      
      // const testJson = fetch('static/graph.json')
      // testJson.then(res=>res.json().then(json=>
      // {
      //   graph.fromJSON(json)
      // }))
    })
    onDeactivated(() =>
    {
      if (graph.getScrollbarPosition())
        scrollPosition = graph.getScrollbarPosition()
    })
    onActivated(() =>
    {
      if (scrollPosition)
        graph.setScrollbarPosition(scrollPosition.left, scrollPosition.top)
    })
    onBeforeUnmount(() =>
    {
      eveBus.all.clear()
      if (graph)
        graph.dispose()
    })

    expose({ dragEnd })

    return {
      container,
      menuPosition,
      editEdge,
      dragEnd,
      excute,
      pasteFun
    }
  }
})

</script>