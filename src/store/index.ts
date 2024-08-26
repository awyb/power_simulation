import { createStore } from 'vuex'
import { module as moduleA } from './variable'
import { module as moduleB } from './graphConfig'
export default createStore({
  state: {
    pageHeaderH: 40,
    pageFooterH: 25,
    leftSideW: 40,
    leftMenuW: 300,
    rightMenuW: 350,
    rmenuBoxW: 232,
    rmenuBoxH: 400,
    curComp:null
  },
  getters: {
  },
  mutations: {
    async changeUrl(state, comp)
    {
      state.curComp = comp
    }
  },
  actions: {
    async changeUrl(context, comp)
    {
      context.commit('changeUrl', comp)
    }
  },
  modules: {
    variable: moduleA,
    graphConfig: moduleB
  }
})
