import { add, update, del } from '@/request/index'
import { variable } from '@/components/interface/interfaceBase'
import { compareArrays } from '@/components/ts/compare'
// export interface variable {
//   id: number;
//   name: string;
//   disptype: number;
//   disporder: number;
//   val: string;
//   isval: number;
//   prjid: number;
//   expression: string;
// }
export interface variableState
{
  global: Array<variable>;
  oldGlobal: Array<variable>;
}
const state: variableState =
{
  oldGlobal: [],
  global: [],
}
const mutations =
{
  addGlobal(state: variableState, data: variable)
  {
    const alls = [...state.global, ...state.oldGlobal]
    const disporder = alls.length ? Math.max(...alls.map(i=>i.disporder)) + 1 : 1
    const id = alls.length ? Math.max(...alls.map(i => i.id)) + 1 : 1
    state.global.push({ ...data, disporder, id })
  },
  changeGlobal(state: variableState, index:{newIndex:number, oldIndex:number})
  {
    const movedItem = state.global.splice(Number(index.oldIndex), 1)[0]
    state.global.splice(Number(index.newIndex), 0, movedItem)

    const temp = state.global[index.newIndex].disporder
    state.global[index.newIndex].disporder = state.global[index.oldIndex].disporder
    state.global[index.oldIndex].disporder = temp
  },
  removeGlobal(state: variableState, data: variable)
  {
    const index = state.global.findIndex((item) => item.id === data.id)
    state.global.splice(index, 1)
  },
  initGlobal(state: variableState, data: Array<variable>)
  {
    state.global = data
    state.oldGlobal = JSON.parse(JSON.stringify(data))
  }
}
const actions =
{
  update(context: any)
  {
    const tabname = 'global_var'
    const { added, removed, updated } = compareArrays(context.state.oldGlobal, context.state.global)
    const alls = []
    if (added.length)
    {
      added.forEach(item=>
      {
        const { id, ...insert } = item
        alls.push(add({ tabname, data: insert }))
      })
    }
    if (removed.length)
    {
      const ids = removed.map(item => item.id).toString()
      alls.push(del({ tabname, ids }))
    }
    if (updated.length)
    {
      updated.forEach(item =>
      {
        const { id, ...data } = item.new
        alls.push(update({ tabname, id, data}))
      })
    }
    if (alls.length)
    {
      Promise.all(alls).then(ret=>
      {
        added.forEach((u, index) =>
        {
          const findU = state.global.find((item: variable) => item.id === u.id)
          findU && (findU.id = ret[index].data.id)
        })
        state.oldGlobal = JSON.parse(JSON.stringify(context.state.global))
      })
    }
  }
}
export const module =
{
  namespaced: true,
  state,
  actions,
  mutations
}