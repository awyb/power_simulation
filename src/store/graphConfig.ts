export interface GraphConfig {
  bgcolor: string;
  gridtype: string;
  gridcolor: string;
  pagesplit: boolean;
  defdragpage: boolean;
  celllabel: boolean;
  portlabel: boolean;
}
const state: GraphConfig = {
  bgcolor: '#fff', // 背景色
  gridtype:'doubleMesh', // 网格类型
  gridcolor:'#f5f5f5', // 网格颜色
  pagesplit: true, // 页面分割线
  defdragpage:false, // 默认拖拽画布
  celllabel:false, // 元件标签
  portlabel:false, // 引脚标签
}
const mutations= {
  updState(state: GraphConfig, payload: Partial<GraphConfig>)
  {
    Object.assign(state, payload)
  }
}
export const module = {
  namespaced: true,
  state,
  mutations
}

