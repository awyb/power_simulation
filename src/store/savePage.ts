export interface SavePage {
  needExcute: Excute[];
  index: number;
}
export interface Excute{
  index: number;
  type: 'add' | 'update' | 'delete';
  exp: any;
}
const state: SavePage = {
  needExcute: [],
  index:0
}
const mutations = {
  addExcute(state: SavePage, payload: Excute)
  {
    state.index++
    state.needExcute.push({ ...payload, index: state.index })
  },
  removeExcute(state: SavePage, payload: Excute)
  {
    state.needExcute = state.needExcute.filter((item) => item.index !== payload.index)
  }
}
export const module = {
  namespaced: true,
  state,
  mutations
}

