<style scoped lang="less">
  .cell-info { height: calc(100% - 40px);width: 100%; padding: 20px 0; display: flex;flex-direction: column;background: var(--color1);
    .top {width: 100%;height: 70px;
      .description {margin: 5px;
        .iconfont {font-size: 20px;vertical-align: middle;}
      }
      .title {font-size: 10px;margin-left: 20px;color:#676767e8}
    }
    .info-tabs { flex: 1;position: relative;height:0%;
      /deep/ .el-tabs__content {height: calc(100% - 50px);overflow-y: auto;}
      .el-input, .el-select, .el-switch {width: 140px;height: 30px;}
      .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;margin-right:10px;width: 20px;}
    }
  }
  /deep/ .el-form-item__label {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline;}
  /deep/ .el-tabs__nav {transform: translateX(30px) !important;}
  /deep/ .el-form-item {margin-bottom:5px;}
  /deep/ .el-form-item__content {justify-content: end;}
  /deep/ .el-collapse-item__header { padding-left:20px; }
  /deep/ .el-collapse { --el-collapse-border-color: var(--collapse-border-color); }
  /deep/ .el-collapse:first-of-type {border: none;}
  /deep/ .el-collapse-item__content {padding-bottom:0;}
  /deep/ .colorBtn{box-shadow: 1px 1px 1px 1px #5b5b5b;}
  /deep/ .box{top: 0;right: 0;}
  .el-pick-color{display: contents;}
  .add-global {text-align: center;cursor: pointer;font-size: 14px;color:rgba(0, 0, 0,0.6);font-weight: bold;}
  .line-config {width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;}
  .keyname {font-weight: bold;color: green;padding:2px; margin-left: 5px;background: rgb(233, 233, 233);font-style: italic;border-radius: 4px;}
</style>
<template>
  <div class="cell-info">
    <div class="top" v-if="description">
      <div class="description">
        <i :class="'iconfont '+description.icon"></i>
        <el-input v-model="description.namec" class="name-input" style="width: 300px;" @change="updateName"/>
      </div>
      <label class="title">{{ description.classify }}</label>
    </div>
    <el-tabs v-model="actTab" class="info-tabs" @tab-click="handleClick">
      <el-tab-pane label="参数" name="param" v-if="graphType==='node'||graphType==='edge'">
        <el-collapse v-model="collapseExp.main" v-if="graphType==='node'">
          <el-collapse-item name="attr" title="属性">
            <att-form v-if="attConfig"
              style="width: 300px;padding: 10px 20px 10px 40px;"
              :attFlds="attConfig"
              :language="'ch'"
              @on-change="updateAttr"
              @on-click="(args)=>transformFunc(args,'node_attr')"/>
          </el-collapse-item>
          <el-collapse-item name="param" title="参数">
            <el-collapse v-model="collapseExp.param" style="padding-left: 20px;">
              <el-collapse-item  v-show="collapse.show"
                v-for="collapse in collapseItem"
                :key="collapse.classify"
                :name="collapse.classify"
                :title="collapse.classify">
                <template #title>
                  <el-tooltip :content="collapse.classifydescribe" placement="left" effect="light">
                    <span>{{ collapse.classify }}</span>
                  </el-tooltip>
                </template>
                <att-form style="width: 300px;padding: 10px 20px;"
                  :attFlds="collapse.children"
                  @hidden-classify="hiddenClassify"
                  @on-change="updateParam"
                  @on-click="(args)=>transformFunc(args,'node_params')"/>
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
           <el-collapse-item name="pin" title="引脚" v-if="graphType==='node'">
            <el-form :model="portForm" label-width="120px" style="width: 300px;padding: 10px 20px 10px 40px;">
              <el-form-item :label="port.name" v-for="(port,index) in ports" :key="index">
                <template #label="{label}">
                  <el-tooltip :content="label" placement="left" effect="light">
                    <template #content>
                      <span style="font-weight: bold;">{{port.name}}</span>
                      <span class="keyname" v-if="port.keyname">{{port.keyname}}</span>
                      <hr />
                      <span>{{port.describe}}</span>
                    </template>
                    <span>{{label}}</span>
                  </el-tooltip>
                </template>
                <el-input v-model="portForm[port.name]" class="el-input" @change="updatePort(port)"/>
                <label class="end-label" @click="port.isval=!port.isval" v-html="port.isval?'(x)':'ƒ<sub>x</sub>'"></label>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div class="line-config" v-else-if="graphType==='edge'">
          连接线配置
        </div>
      </el-tab-pane>
      <el-tab-pane label="格式" name="format" v-if="graphType==='node'||graphType==='edge'">
      </el-tab-pane>
      <el-tab-pane label="全局变量" name="globalVariable" v-if="graphType==='blank'">
        <vue-draggable :modelValue="global" :animation="100" @end="onEnd">
          <var-input v-for="g in global" :key="g.id" :params="g" :menus="menus" />
        </vue-draggable>
        <div class="add-global" @click="addGlobal">(x)新建全局变量</div>
      </el-tab-pane>
      <el-tab-pane label="图纸选项" name="graphConfig" v-if="graphType==='blank'">
        <att-form v-if="pageFlds"
          style="width: 300px;padding: 10px 20px;"
          :language="'ch'"
          :show-describle="false"
          :show-transform="false"
          :attFlds="pageFlds"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, watch} from 'vue'
import { useStore } from 'vuex'
import { type SortableEvent, VueDraggable } from 'vue-draggable-plus'

import VarInput from '@/components/VarInput.vue'
import AttForm from '@/components/AttForm.vue'

import eveBus from '@/components/ts/eveBus'
import common from '@/components/ts/common'
import { query } from '@/request'

import { variable, attFld, collapseItem, description } from '@/components/interface/interfaceBase'

let isFirst = true
let tabIndex = 0
// 接收菜单信息
export default defineComponent({
  components: { VarInput, VueDraggable, AttForm },
  name: 'CellInfo',
  props: {
    params: {
      type: Object,
      default: () => ({ type: 'blank' }),
    },
    projectId: {
      type: Number,
    }
  },
  setup(props, { expose })
  {
    const store = useStore()
    const disabled = ref(false)
    const pageFlds = ref<attFld[]|null>(null)
    const global = ref<variable[]>([])
    const actTab = ref<string>('globalVariable')
    const graphType = ref<string>('blank')
    const description = ref<description | null>(null)
    const portForm: { [key: string]: any } = reactive({})
    const collapseExp: { [key: string]: any } = reactive({ main: ['attr', 'param', 'pin'], param: [] })
    const attConfig = ref<attFld[] | null>(null)
    const collapseItem = ref<collapseItem[]>([])
    const ports = ref<any[]>([])
    const menus = reactive([{
      name: 'delete',
      namec: '删除',
      icon: 'iconfont icon-shanchu',
      click: (data: any) =>
      {
        store.commit('variable/removeGlobal', data)
      },
    }])
    const initGlobal = () =>
    {
      query({ tabname: 'global_var', exp:`prjid = ${props.projectId}`, orderby: 'disporder'}).then(res=>
      {
        isFirst = true
        store.commit('variable/initGlobal', res.data)
        global.value = res.data
      })
    }
    watch(() => store.state.variable.global, () =>
    {
      if (isFirst)
        isFirst = false
      else
        store.commit('changeNeedSave', true)
    }, { deep: true })
    watch(() => props.params, async(newValue) =>
    {
      graphType.value = newValue.type
      actTab.value = (newValue.type === 'blank' ? ['globalVariable', 'graphConfig'] : ['param', 'format'])[tabIndex]
      description.value = newValue.description
      if (props.params.type==='edge') // 连接线
      {
        
      }
      else if (props.params.type==='node') // 节点
      {
        collapseItem.value = []
        const nodeData = newValue.cell.data
        const func_memory = nodeData.func_memory
        const config = await common.getNodeConfig(nodeData.name)
        const pin = nodeData.prjnodeInfo.pin
        const params = nodeData.prjnodeInfo.params
        const attribute = nodeData.prjnodeInfo.attribute
        attConfig.value?.forEach(fld =>
        {
          const ffunc = func_memory.find((f:any)=>f.tabname==='node_attr'&&f.fldid === fld.id)
          fld.isval = ffunc ? 0 : 1
          if (attribute[fld.name]!== undefined)
          {
            fld.value = attribute[fld.name]
            if (fld.disptype === 2)
            {
              const f = fld.fldvalue?.find(i => i.colname === fld.name && i.dbvalue === fld.value)
              if (f)
                fld.value_ = f.dispc
            }
            else if (fld.disptype === 3)
              fld.value = ((fld.value.toString() === 'true') ? true : false)
          }
          else
            fld.value = ''
        })
        ports.value = nodeData.ports.map((p:any)=>({...p, isval:true, unit:''}))
        if (pin)
        {
          Object.keys(pin).forEach(key =>
          {
            portForm[key] = pin[key]
          })
        }
        config.forEach(c =>
        {
          c.show = true
          collapseExp.param.push(c.classify)
          if (c.children)
          {
            c.children.forEach(cc =>
            {
              cc.isval = 1
              cc.value = cc.defval
              cc.value_ = cc.defval
              const ffunc = func_memory.find((f:any)=>f.tabname==='node_params'&&f.fldid === cc.id)
              cc.isval = ffunc ? 0 : 1
              if (params && params[cc.classify]&&params[cc.classify][cc.name]!==undefined)
              {
                cc.value = params[cc.classify][cc.name]
                cc.value_ = params[cc.classify][cc.name]
              }
              if (cc.disptype === 2)
              {
                const f = cc.fldvalue?.find(i => i.colname === cc.name && i.dbvalue === cc.value)
                if (f)
                  cc.value_ = f.dispc
              }
            })
          }
        })
        collapseItem.value = config
      }
    })
    watch(() => props.projectId, () =>
    {
      initGlobal()
    })
    function handleClick(v:any)
    {
      tabIndex = Number(v.index)
    }
    function addGlobal()
    {
      const add = { name: 'variable_' + (global.value?.length + 1), value: '', isval: 1, prjid: props.projectId, expression: '' }
      store.commit('variable/addGlobal', add)
    }
    function onEnd(e: SortableEvent)
    {
      const { newIndex, oldIndex } = e
      store.commit('variable/changeGlobal', {oldIndex:Number(oldIndex), newIndex:Number(newIndex)})
    }
    function updatePort(port:any)
    {
      const cell = props.params.cell
      const opin = JSON.parse(JSON.stringify(cell.data.prjnodeInfo.pin))
      store.dispatch('savePage/addExcute', {
        type: 'update', index: cell.id, tabname: 'project_nodes',
        args: {
          id: cell.data.prjnodeInfo.id,
          pin: {...opin, [port.name]:portForm[port.name]},
        },
        onCancle: () =>
        {
          cell.data.prjnodeInfo.pin[port.name] = ''
        }
      })
      cell.data.prjnodeInfo.pin[port.name] = portForm[port.name]
      eveBus.emit('graph-update-port-label', {cellid:cell.id, portid:port.id, portname:port.name, conn:portForm[port.name], type: port._group})
    }
    function hiddenClassify(classifys: string[])
    {
      collapseItem.value.forEach(item =>
      {
        if (classifys.includes(item.classify))
          item.show = false
        else
          item.show = true
      })
    }
    function updateAttr(args: any)
    {
      console.log('updateAttr', args)
      const cell = props.params.cell
      const oattribute = JSON.parse(JSON.stringify(cell.data.prjnodeInfo.attribute))
      store.dispatch('savePage/addExcute', {
        type: 'update', index: cell.id, tabname: 'project_nodes',
        args: {
          id: cell.data.prjnodeInfo.id,
          attribute:{ ...oattribute, [args.name]:args.value },
        },
        onCancle: () =>
        {
          console.log()
        }
      })
      cell.data.prjnodeInfo.attribute = {...oattribute, [args.name]:args.value }
    }
    function updateName()
    {
      if (!description.value)
        return
      const cell = props.params.cell
      store.dispatch('savePage/addExcute', {
        type: 'update', index: props.params.description.key, tabname: props.params.description.tabname,
        args: {
          id: props.params.description.id,
          namec: description.value.namec,
        },
        onCancle: () =>
        {
          console.log()
        }
      })
      if (cell)
      {
        cell.label = description.value.namec
        cell.data.prjnodeInfo.namec = description.value.namec
      }
      
    }
    function transformFunc(args: any, tabname?: string)
    {
      const cell = props.params.cell
      const func_memory = cell.data.func_memory
      const findIndex_ = func_memory.findIndex((item: any) => item.tabname === tabname && item.fldid === args.id)
      if (findIndex_>-1&&args.isval)
      {
        store.dispatch('savePage/addExcute', {
          type: 'delete', index: `func_memory_${args.id}_${cell.id}`, tabname: 'func_memory',
          args: {
            id: func_memory[findIndex_].id,
          },
          onCancle: () =>
          {
            console.log()
          }
        })
        cell.data.func_memory.splice(findIndex_, 1)
      }
      else if (findIndex_===-1 && !args.isval)
      {
        const add = {
          id: 0,
          tabname,
          fldid: args.id,
          cellkey: cell.id,
          prjid: props.projectId
        }
        store.dispatch('savePage/addExcute', {
          type: 'add', index: `func_memory_${args.id}_${cell.id}`, tabname: 'func_memory',
          args: add,
          onCancle: () =>
          {
            console.log()
          },
          onOk: (args: any) =>
          {
            add.id = args.id
          }
        })
        cell.data.func_memory.push(add)
      }
    }
    function updateParam(args: any)
    {
      const cell = props.params.cell
      const oparams = JSON.parse(JSON.stringify(cell.data.prjnodeInfo.params))
      const classifys = oparams[args.classify]
      store.dispatch('savePage/addExcute', {
        type: 'update', index: cell.id, tabname: 'project_nodes',
        args: {
          id: cell.data.prjnodeInfo.id,
          params:{ ...oparams, [args.classify]:{...classifys, [args.name]:args.value} },
        },
        onCancle: () =>
        {
          console.log()
        }
      })
      cell.data.prjnodeInfo.params[args.classify] = {...classifys, [args.name]:args.value}
    }
    (function()
    {
      common.getAttr().then(obj =>
      {
        const temp:attFld[] = []
        obj.flds.forEach(fld=>
        {
          const t:attFld = { ...fld, isval: 1, value: fld.defval, value_: fld.defval, disabled: false, fldvalue: []}
          if (fld.disptype === 2)
          {
            const f = obj.fldvalue.find(i => i.colname === fld.name && i.dbvalue === t.value)
            if (f)
              t.value_ = f.dispc
          }
          else if (fld.disptype === 3)
            t.value = ((t.value.toString() === 'true') ? true : false)
          temp.push(t)
        })
        attConfig.value = temp
      })
    })()
    pageFlds.value = common.getGConfigFlds()
    // 暴露方法
    expose({})
    return {
      collapseItem,
      disabled,
      actTab,
      menus,
      portForm,
      attConfig,
      collapseExp,
      graphType,
      global,
      description,
      ports,
      pageFlds,
      onEnd,
      handleClick,
      addGlobal,
      updatePort,
      hiddenClassify,
      updateParam,
      updateAttr,
      updateName,
      transformFunc
    }
  }
})
</script>


