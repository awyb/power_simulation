
import { Graph, Cell } from '@antv/x6'

class graphEvents
{
  constructor(private graph:Graph)
  {
    this.graph = graph

  }
  // 复制
  copy()
  {
    const graph = this.graph
    graph.bindKey(['meta+c', 'ctrl+c'], () =>
    {
      const cells = graph.getSelectedCells()
      if (cells.length)
        graph.copy(cells)
      return false
    })
  }
  // 剪切
  cut()
  {
    const graph = this.graph
    graph.bindKey(['meta+x', 'ctrl+x'], () =>
    {
      const cells = graph.getSelectedCells()
      if (cells.length)
        graph.cut(cells)
      return false
    })
  }
  // 粘贴
  paste()
  {
    const graph = this.graph
    graph.bindKey(['meta+v', 'ctrl+v'], () =>
    {
      if (!graph.isClipboardEmpty())
      {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })
  }
  // 撤销
  undo()
  {
    const graph = this.graph
    graph.bindKey(['meta+z', 'ctrl+z'], () =>
    {
      if (graph.canUndo())
        graph.undo()
    })
  }
  // 重做
  redo()
  {
    const graph = this.graph
    graph.bindKey(['meta+y', 'ctrl+y'], () =>
    {
      if (graph.canRedo())
        graph.redo()
      return false
    })
  }
  // 删除
  delete()
  {
    const graph = this.graph
    graph.bindKey(['delete', 'backspace'], () =>
    {
      const cells = graph.getSelectedCells()
      if (cells.length)
        graph.removeCells(cells)
    })
  }
  // 全选
  selectall()
  {
    const graph = this.graph
    graph.bindKey(['meta+a', 'ctrl+a'], (e) =>
    {
      e.preventDefault()
      const all = graph.getCells()
      if (all.length)
        graph.select(all)
    })
  }
}

/**
 * 显示隐藏连接桩
 * @param portsVisibility       显示隐藏
 * @param graph                 实例化对象
 */
const showPorts = (portsVisibility: 'visible' | 'hidden', graph:Graph) =>
{
  graph.getNodes().forEach(node =>
  {
    node.getPorts().forEach(port =>
    {
      node.portProp(port.id+'', 'attrs/circle/style/visibility', portsVisibility)
    })
  })
}


/**
 * 添加工具
 * @param cell              元素
 * @param types             工具类型
 * @param toolsConfig       工具配置
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addTools= (cell:Cell, types:string[], toolsConfig:any)=>
{
  types.forEach(type=>
  {
    if (!cell.hasTool(type))
      cell.addTools(toolsConfig[type])
  })
}

/**
 * 绑定快捷键
 * @param graph             实例化对象
 * @param types             快捷键类型    ['copy', 'cut', 'paste', 'undo', 'redo', 'delete']
 */
const bindKey = (graph:Graph, types:Array<keyof graphEvents>)=>
{
  const events = new graphEvents(graph)
  types.forEach(type=>
  {
    if (typeof events[type] === 'function')
      events[type]()
  })
}

export default
{
  showPorts,
  addTools,
  bindKey
}
