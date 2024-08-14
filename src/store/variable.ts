export interface variable {
  id: number;
  name: string;
  label: string;
  unit: string;
  disptype: number;
  default: string;
  isFunc: boolean;
}
export interface variableState {
  global: Array<variable>;
}

const state: variableState = {
  global: [
    {id:1, name:'Rs', label:'', unit:'', disptype:1, default:'0.0001', isFunc:false},
    {id:2, name:'R2', label:'', unit:'', disptype:1, default:'0.228', isFunc:false},
  ],
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
export const module = {
  namespaced: true,
  state,
  mutations
}

