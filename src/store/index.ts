import { createStore } from 'vuex'
import { module as moduleA } from './variable'
import { module as moduleB } from './graphConfig'
import { module as moduleC } from './savePage'
const func = (event: BeforeUnloadEvent) =>
{
  event.preventDefault()
}
export default createStore({
  state: {
    pageHeaderH: 40,
    pageFooterH: 25,
    leftSideW: 40,
    leftMenuW: 300,
    rightMenuW: 350,
    rmenuBoxW: 232,
    rmenuBoxH: 400,
    curComp: null,
    needSave: false,
  },
  getters: {
  },
  mutations: {
    changeUrl(state, comp)
    {
      state.curComp = comp
    },
    changeNeedSave(state, bool)
    {
      bool ? window.addEventListener('beforeunload', func): window.removeEventListener('beforeunload', func)
      state.needSave = bool
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
    graphConfig: moduleB,
    savePage: moduleC
  }
})
