import { createStore } from 'vuex'
import { module as moduleA } from './variable'
import { module as moduleB } from './graphConfig'
export default createStore({
  state: {
    pageHeaderH:30,
    pageFooterH:30,
    leftMenuW:300,
    rightMenuW:350,
    rmenuBoxW:232,
    rmenuBoxH:400,
  },
  getters: {
  },
  mutations: {

  },
  actions: {
  },
  modules: {
    variable: moduleA,
    graphConfig: moduleB
  }
})
