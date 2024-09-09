<style scoped lang="less">
  .cell-info { height: calc(100% - 40px);width: 100%; padding: 20px 0; display: flex;flex-direction: column;background: var(--color1);
    .top{width: 100%;height: 70px;
      .description{margin: 5px;}
      .title{font-size: 10px;margin-left: 20px;color:#676767e8}
    }
    .info-tabs { flex: 1;position: relative;height:0%;
      /deep/ .el-tabs__content{height: calc(100% - 50px);overflow-y: auto;}
      .el-input, .el-select, .el-switch {width: 140px;height: 30px;}
      .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;margin-right:10px;width: 20px;}
    }
  }

  /deep/.el-form-item__label {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline;}
  /deep/.el-tabs__nav{transform: translateX(30px) !important;}
  /deep/.el-form-item{margin-bottom:5px;}
  /deep/.el-form-item__content{justify-content: end;}
  /deep/ .el-collapse-item__header { padding-left:20px; }
  /deep/ .el-collapse { --el-collapse-border-color: var(--collapse-border-color); }
  /deep/ .el-collapse:first-of-type{border: none;}
  /deep/ .el-collapse-item__content{padding-bottom:0;}
  .add-global{text-align: center;cursor: pointer;font-size: 14px;color:rgba(0, 0, 0,0.6);font-weight: bold;}
  .line-config{width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;}
  .keyname{font-weight: bold;color: green;padding:2px; margin-left: 5px;background: rgb(233, 233, 233);font-style: italic;border-radius: 4px;}

</style>
<template>
  <div class="cell-info">
    <div class="top">
      <div class="description">
        <i :class="'iconfont '+description.icon" style="font-size: 20px;vertical-align: middle;"></i>
        <el-input v-model="description.name" class="name-input" style="width: 300px;"/>
      </div>
      <label class="title">{{ description.type }}</label>
    </div>
    <el-tabs v-model="actTab" class="info-tabs" @tab-click="handleClick">
      <el-tab-pane label="参数" name="param" v-if="graphType==='node'||graphType==='edge'" style="height: 100%;">
        <el-collapse v-model="collapseExp.main" v-if="graphType==='node'">
          <el-collapse-item name="attr" title="属性">
            <AttForm v-if="attConfig" :attFlds="attConfig" style="width: 300px;padding: 10px 20px 10px 40px;"></AttForm>
          </el-collapse-item>
          <el-collapse-item name="param" title="参数">
            <el-collapse v-model="collapseExp.param" style="padding-left: 20px;">
              <el-collapse-item v-for="collapse in collapseItem" :key="collapse.classify" :name="collapse.classify" :title="collapse.classify">
                <template #title>
                  <el-tooltip :content="collapse.classifydescribe" placement="left" effect="light">
                    <span>{{ collapse.classify }}</span>
                  </el-tooltip>
                </template>
                <AttForm :attFlds="collapse.children"  style="width: 300px;padding: 10px 20px;"></AttForm>
              </el-collapse-item>
              <!-- <el-collapse-item name="config" title="Configuration">
                <el-form :model="portForm" label-width="120px" style="width: 300px;padding: 10px 20px;">
                  <el-form-item :label="item.label" v-for="(item,index) in flds" :key="index">
                    <template #label="{label}">
                      <el-tooltip :content="label" placement="left">
                        <span>{{label}}</span>
                      </el-tooltip>
                    </template>
                    <el-input v-if="item.disptype===1||!item.isval" v-model="portForm[item.name]" class="el-input">
                      <template v-if="item.isval" #suffix>{{ item.unit }}</template>
                    </el-input>
                    <el-select v-else-if="item.disptype===2" v-model="portForm[item.name]" class="el-select">
                      <el-option
                        v-for="(sel,i) in item.fldValue"
                        :label="sel.disp"
                        :value="sel.dbvalue"
                        :key="i"
                      />
                    </el-select>
                    <label class="end-label" @click="item.isval=!item.isval" v-html="item.isval?'(x)':'ƒ<sub>x</sub>'"></label>
                  </el-form-item>
                </el-form>
              </el-collapse-item> -->
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
                <el-input v-model="portForm[port.name]" class="el-input" @blur="updatePort(port)"/>
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
        Config
      </el-tab-pane>
      <el-tab-pane label="全局变量" name="globalVariable" v-if="graphType==='blank'">
        <Draggable ref="dragEl"
          ghostClass="ghost"
          handle=".icon-drag"
          :modelValue="global"
          :disabled="disabled"
          :animation="150"
          @start="onStart"
          @update="onUpdate"
          @end="onEnd">
          <var-form v-for="g in global" :key="g.id" :params="g" :menus="menus"></var-form>
        </Draggable>
        <div class="add-global" @click="addGlobal">(x)新建全局变量</div>
      </el-tab-pane>
      <el-tab-pane label="图纸选项" name="graphConfig" v-if="graphType==='blank'">
        <DynForm :params="csparams" @onChange="updState"></DynForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch } from 'vue'
import AttForm from '@/components/AttForm.vue'
import common from '@/components/ts/common'
import { useStore } from 'vuex'
import VarForm from '@/components/VarForm.vue'
import DynForm from '@/components/DynForm.vue'
import { variable, nodeParams, nodeDbValue, nodeAttr, attFld, collapseItem } from '@/components/interface/interfaceBase'
import { query } from '@/request'
import eveBus from '@/components/ts/eveBus'
import { type UseDraggableReturn, type SortableEvent, VueDraggable } from 'vue-draggable-plus'
let isFirst = true
// 接收菜单信息
export default defineComponent({
  components:{ VarForm, DynForm, Draggable:VueDraggable, AttForm},
  name: 'CellInfo',
  props:{
    params: {
      type: Object,
      default: ()=>({type:'blank'}),
    }
  },
  setup(props, { expose })
  {
    const store = useStore()
    const disabled = ref(false)
    const menus = reactive([{
      name: 'delete',
      namec: '删除',
      icon: 'iconfont icon-shanchu',
      click: (data: any) =>
      {
        store.commit('variable/removeGlobal', data)
      },
    }])
    

    const csparams = reactive({
      form:{},
      flds:common.getGConfigFlds()
    })
    const global = ref<variable[]>([])
    let _fld = common.getFlds()
    // common.getFlds().then(res=>
    // {
    //   _fld = res
    // })
    const _fldvalue = common.getFldValues()
    const actTab = ref<string>('globalVariable')
    const isval = ref<boolean>(true)
    const graphType = ref<string>('blank')
    const description = reactive({name:'图纸', type:'电力仿真-画布', icon:'icon-huabu'})
    const portForm:{[key: string]: any} = reactive({})
    const collapseExp:{[key: string]: any} = reactive({
      main:['attr', 'param', 'pin'],
      param:[]
    })
    const attConfig = ref<attFld[]|null>(null)
    // const attConfig = reactive<nodeAttr[]>([
    //   {name:'enable', namec: '启用', unit: '',disptype:3, fldvalue:[], value:true},
    //   {name:'outlinelevel', namec: '大纲级别', unit: '', disptype:1, fldvalue:[], value:0},
    // ])
    let flds = reactive<nodeParams[]>([])
    const collapseItem = ref<collapseItem[]>([])
    const ports = ref<any[]>([])
    
    const updVal = () =>
    {
      const graphConfig = store.state.graphConfig
      csparams.flds.forEach(fld=>
      {
        if (graphConfig[fld.name])
          fld.value = graphConfig[fld.name]
      })
    }
    watch(() => store.state.variable.global, ()=>
    {
      if (isFirst)
        isFirst = false
      else
        store.commit('changeNeedSave', true)
    }, { deep: true })
    watch(() => props.params, async(newValue, oldValue) =>
    {
      if (oldValue&&(newValue.type==='blank'&&oldValue.type==='blank'))
        return
      updVal()
      graphType.value = newValue.type
      if (props.params.type==='blank') // 画布
      {
        actTab.value =(actTab.value==='param')?'globalVariable':'graphConfig'
        description.name = '图纸'
        description.icon = 'icon-huabu'
        description.type = '电力仿真-画布'
        return
      }
      else if (props.params.type==='edge') // 连接线
      {
        actTab.value = (actTab.value==='globalVariable'||actTab.value==='param')?'param':'format'
        description.icon = 'icon-xian'
        description.name = newValue.data.namec
        description.type = '连接线'
        return
      }
      else // 节点
      {
        ports.value = newValue.data.data.ports.map((p:any)=>({...p, isval:true, unit:''}))
        actTab.value = (actTab.value==='globalVariable'||actTab.value==='param')?'param':'format'
        description.icon = 'icon-node'
        description.name = newValue.data.namec
        description.type = newValue.data.data.namec
        const config = await common.getNodeConfig(newValue.data.data.name)
        config.forEach(c =>
        {
          collapseExp.param.push(c.classify)
          if (c.children)
          {
            c.children.forEach(cc =>
            {
              cc.isval = 1
              cc.value = cc.defval
              cc.value_ = cc.defval
              if (newValue.data.data.params && newValue.data.data.params[cc.classify])
              {
                cc.value = newValue.data.data.params[cc.classify][cc.name]
                cc.value_ = newValue.data.data.params[cc.classify][cc.name]
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
    const updState = (param:any)=>
    {
     
      if (Object.prototype.toString.call({})==='[object Object]')
      {
        const obj:{ [key: string]: any } = {}
        obj[param.name] = param.value
        store.commit('graphConfig/updState', obj)
      }
    }
    const handleClick = () =>
    {
      console.log()
    }
    const addGlobal = ()=>
    {
      const add = { name:'variable_'+(global.value?.length+1), value:'', isval:1, prjid:1, expression:''}
      store.commit('variable/addGlobal', add)
    }
    const onStart = (e: SortableEvent) =>
    {
      console.log('start', e)
    }
    const onEnd = (e: SortableEvent) =>
    {
      const { newIndex, oldIndex } = e
      store.commit('variable/changeGlobal', {oldIndex:Number(oldIndex), newIndex:Number(newIndex)})
    }
    const onUpdate = () =>
    {
      console.log('update')
    }
    function updatePort(port:any)
    {
      eveBus.emit('graph-update-port-label', {cellid:props.params.data.id, portid:port.id, portname:port.name, conn:portForm[port.name]})
    }
    (function()
    {
      query({ tabname: 'global_var', exp:`prjid = 1`, orderby: 'disporder'}).then(res=>
      {
        store.commit('variable/initGlobal', res.data)
        global.value = res.data
      })
      common.getAttr().then(obj =>
      {
        const temp:attFld[] = []
        obj.flds.forEach(fld=>
        {
          const t = { ...fld, isval: 1, value: fld.defval, value_: fld.defval, disabled: false}
          if (fld.disptype === 2)
          {
            const f = obj.fldvalues.find(i => i.colname === fld.name && i.dbvalue === t.value)
            if (f)
              t.value_ = f.dispc
          }
          temp.push(t)
        })
        attConfig.value = temp
      })
    })()
    updVal()
    // 暴露方法
    expose({})
    return {
      collapseItem,
      disabled,
      actTab,
      menus,
      portForm,
      isval,
      attConfig,
      collapseExp,
      graphType,
      global,
      description,
      flds,
      ports,
      csparams,
      onStart,
      onEnd,
      onUpdate,
      updState,
      handleClick,
      addGlobal,
      updatePort
    }
  }
})

</script>


