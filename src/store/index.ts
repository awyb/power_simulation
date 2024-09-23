import { createStore } from 'vuex'
import { module as moduleA } from './variable'
import { module as moduleB } from './savePage'
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
    runAsideW: 350,
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
    savePage: moduleB
  }
})
