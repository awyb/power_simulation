import { add, update, del } from '@/request/index'
export interface SavePage {
  needExcute: Excute[];
}
export interface tabnameList {
  tabname: 'project_nodes' | 'project_edges';
}
export interface Excute extends tabnameList{
  index: number | string;
  type: 'add' | 'update' | 'delete';
  args: any;
  onOk?: (args:any) => void;
  onCancle?: (args:any) => void;
}
const state: SavePage = {
  needExcute: []
}
const mutations = {
  
}
const actions = {
  update()
  {
    const dels: any = {}
    state.needExcute.forEach(need =>
    {
      if (need.type === 'update')
      {
        const { id, ...data } = need.args
        // need.onSure()
        update({ tabname: need.tabname, id, data})
      }
      else if (need.type === 'add')
      {
        const { id, ...data } = need.args
        add({ tabname: need.tabname, data }).then(res =>
        {
          if (res.status === 200 && need.onOk)
            need.onOk(res.data)
        })
      }
      else if (need.type === 'delete')
      {
        if (dels[need.tabname])
          dels[need.tabname].push(need.args.id)
        else
          dels[need.tabname] = [need.args.id]
      }
    })
    Object.keys(dels).forEach(tabname =>
    {
      del({ tabname, ids: dels[tabname].toString() })
    })
    state.needExcute = []
  },
  addExcute(context:any, payload: Excute)
  {
    if (payload.type === 'delete')
    {
      const pre = state.needExcute.filter(n => n.index === payload.index && n.tabname === payload.tabname)
      if ( pre.length)
        state.needExcute = state.needExcute.filter((item) => !pre.map(i => i.index).includes(item.index))
      if (typeof payload.args.id === 'number')
        state.needExcute.push(payload)
    }
    else if (payload.type === 'update')
    {
      const find = state.needExcute.find(n => n.index === payload.index && n.tabname === payload.tabname)
      if (find)
        find.args = { ...find.args, ...payload.args }
      else
        state.needExcute.push(payload)
    }
    else if (payload.type === 'add')
      state.needExcute.push(payload)
    
    context.commit('changeNeedSave', true, { root: true })
      
  },
  removeExcute(context: any, payload: Excute |undefined)
  {
    if (!payload)
      state.needExcute.pop()
    else
      state.needExcute = state.needExcute.filter((item) => item.index !== payload.index)
  }
}
export const module = {
  namespaced: true,
  state,
  mutations,
  actions
}

