import { query } from '@/request/index'
export interface variable {
  id: number;
  name: string;
  label: string;
  unit: string;
  disptype: number;
  defval: string;
  isval: boolean;
}
export interface variableState {
  global: Array<variable>;
}

const state: variableState = {
  global: [],
}
const mutations= {
  addGlobal(state: variableState, data: variable)
  {
    state.global.push(data)
  },
  changeGlobal(state: variableState, index:{newIndex:number, oldIndex:number})
  {
    const movedItem = state.global.splice(Number(index.oldIndex), 1)[0]
    state.global.splice(Number(index.newIndex), 0, movedItem)
  }
}
const actions = {
  init(context: any)
  {
    query({ tabname: 'flds', exp:`classify = 'global'`, orderby: 'disporder'}).then((res: any)=>
    {
      if (res.data)
      {
        res.data.forEach((item:any)=>
        {
          context.commit('addGlobal', { ...item, isval:Boolean(item.isval) })
        })
      }
    })
  }
}
export const module = {
  namespaced: true,
  state,
  actions,
  mutations
}

