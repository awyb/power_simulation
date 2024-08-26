import { Graph} from '@antv/x6'

const keyObj =
{
  copy:['ctrl+c', 'meta+c'],
  paste:['ctrl+v', 'meta+v'],
  delete:['delete', 'backspace'],
  cut:['ctrl+x', 'meta+x'],
  undo:['ctrl+z', 'meta+z'],
  redo:['meta+y', 'ctrl+y'],
  selectall:['ctrl+a', 'meta+a'],
  create:['meta+d', 'ctrl+d'],
  rotateR:['meta+r', 'ctrl+r'],
  rotateL:['meta+shift+r', 'ctrl+shift+r']
}

export class graphEvents
{
  constructor(private graph:Graph)
  {
    this.graph = graph
  }

  // 绑定操作
  bindOper(key:string|Array<string>)
  {
    const keys = Array.isArray(key) ? key : [key]
    keys.forEach((_key) =>
    {
      // 使用 Object.prototype.hasOwnProperty.call 来避免潜在的原型链污染问题
      if (Object.prototype.hasOwnProperty.call(keyObj, _key)&&typeof (this as any)[_key] === 'function')
        this.graph.bindKey((keyObj as any)[_key], (this as any)[_key].bind(this))
    })
  }
  // 旋转
  rotate(rl:'r'|'l'='r', e:KeyboardEvent|null)
  {
    if (e)
    {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const cells = this.graph.getSelectedCells()
    if (cells.length)
    {
      cells.forEach(cell =>
      {
        if (cell.isNode())
        {
          let rotation = Number(cell.attr('rotation')) || 0
          // 旋转90度
          rotation += (rl==='r'?1:-1)*90
          // 更新节点旋转属性
          cell.rotate(rotation)
        }
      })
    }
  }
  // 旋转逆时针
  rotateL(e:KeyboardEvent|null)
  {
    this.rotate('l', e)
  }
  // 旋转顺时针
  rotateR(e:KeyboardEvent|null)
  {
    this.rotate('r', e)
  }
  // 创建
  create(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    const cells = this.graph.getSelectedCells()
    
    if (cells.length)
    {
      this.graph.copy(cells)

      const _cells = this.graph.paste({ offset: 32 })
      this.graph.cleanSelection()
      this.graph.select(_cells)
    }
     
    return false
  }
  // 复制
  copy(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    const cells = this.graph.getSelectedCells()
    if (cells.length)
      this.graph.copy(cells)
    return false
  }
  // 剪切
  cut(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    const cells = this.graph.getSelectedCells()
    if (cells.length)
      this.graph.cut(cells)
    return false
  }
  // 粘贴
  paste(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    if (!this.graph.isClipboardEmpty())
    {
      const cells = this.graph.paste({ offset: 32 })
      this.graph.cleanSelection()
      this.graph.select(cells)
    }
    return false
  }
  // 撤销
  undo(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    if (this.graph.canUndo())
      this.graph.undo()
  }
  // 重做
  redo(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    if (this.graph.canRedo())
      this.graph.redo()
    return false
  }
  // 删除
  delete(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    const cells = this.graph.getSelectedCells()
    if (cells.length)
      this.graph.removeCells(cells)
  }
  // 全选
  selectall(e:KeyboardEvent|null)
  {
    e&&e.preventDefault()
    const all = this.graph.getCells()
    if (all.length)
      this.graph.select(all)
  }
}