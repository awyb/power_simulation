<style scoped lang="less">
  .cell-info { height: calc(100% - 40px);width: 100%; padding: 20px 0; display: flex;flex-direction: column;
    .top{width: 100%;height: 70px;
      .description{margin: 5px;}
      .title{font-size: 10px;margin-left: 20px;color:#676767e8}
    }
    .info-tabs { flex: 1;position: relative;height:0%;
      /deep/ .el-tabs__content{height: calc(100% - 50px);overflow-y: auto;}
      .el-input, .el-select, .el-switch {width: 150px;height: 30px;}
      .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;}
    }
  }
  /deep/.el-form-item__label {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline;}
  /deep/.el-tabs__nav{transform: translateX(30px) !important;}
  /deep/.el-form-item{margin-bottom:5px;}
  .add-global{text-align: center;cursor: pointer;font-size: 14px;color:rgba(0, 0, 0,0.6);font-weight: bold;}
  .line-config{width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;}
</style>
<template>
  <div class="cell-info">
    <div class="top">
      <div class="description">
        <i :class="'iconfont '+description.icon" style="font-size: 20px;vertical-align: middle;"></i>
        <el-input v-model="description.name" class="name-input" style="width: 300px;"/>
      </div>
      <label class="title">{{ description.namec }}</label>
    </div>
    <el-tabs v-model="actTab" class="info-tabs" @tab-click="handleClick">
      <el-tab-pane label="参数" name="param" v-if="graphType==='node'||graphType==='edge'" style="height: 100%;">
        <el-collapse v-model="collapseExp.main" v-if="graphType==='node'">
          <el-collapse-item name="1" title="属性">
            <el-form label-width="120px" style="width: 300px;padding: 10px 20px;">
              <el-form-item :label="item.label" v-for="(item,index) in attConfig" :key="index">
                <template #label="{label}">
                  <el-tooltip :content="label" placement="left">
                    <span>{{label}}</span>
                  </el-tooltip>
                </template>
                <el-input v-if="item.disptype===1||!item.isValue" v-model="item.value" class="el-input">
                  <template v-if="item.isValue" #suffix>{{ item.unit }}</template>
                </el-input>
                <el-select v-else-if="item.disptype===2" v-model="item.value" class="el-select">
                  <el-option
                    v-for="(sel,i) in item.fldValue"
                    :label="sel.disp"
                    :value="sel.dbvalue"
                    :key="i"
                  />
                </el-select>
                <el-switch v-else-if="item.disptype===3" size="small" v-model="item.value" :active-text="item.value?'是':'否'" class="el-switch"/>
                <label class="end-label" @click="item.isValue=!item.isValue" v-html="item.isValue?'(x)':'ƒ<sub>x</sub>'"></label>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item name="2" title="参数">
            <el-collapse v-model="collapseExp.children" style="padding-left: 20px;">
              <el-collapse-item name="1" title="Configuration">
                <el-form :model="configForm" label-width="120px" style="width: 300px;padding: 10px 20px;">
                  <el-form-item :label="item.label" v-for="(item,index) in fldValue" :key="index">
                    <template #label="{label}">
                      <el-tooltip :content="label" placement="left">
                        <span>{{label}}</span>
                      </el-tooltip>
                    </template>
                    <el-input v-if="item.disptype===1||!item.isValue" v-model="configForm[item.name]" class="el-input">
                      <template v-if="item.isValue" #suffix>{{ item.unit }}</template>
                    </el-input>
                    <el-select v-else-if="item.disptype===2" v-model="configForm[item.name]" class="el-select">
                      <el-option
                        v-for="(sel,i) in item.fldValue"
                        :label="sel.disp"
                        :value="sel.dbvalue"
                        :key="i"
                      />
                    </el-select>
                    <label class="end-label" @click="item.isValue=!item.isValue" v-html="item.isValue?'(x)':'ƒ<sub>x</sub>'"></label>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
              <el-collapse-item name="2" title="Configuration-SFEMT">
              </el-collapse-item>
            </el-collapse>
          </el-collapse-item>
        </el-collapse>
        <div class="line-config" v-else-if="graphType==='edge'">
          连接线配置
        </div>
      </el-tab-pane>
      <el-tab-pane label="格式" name="format" v-if="graphType==='node'||graphType==='edge'">Config</el-tab-pane>
      <el-tab-pane label="全局变量" name="globalVariable" v-if="graphType==='blank'">
        <var-form v-for="(g,index) in global" :key="index" :params="{...g,value:g.default,isValue:g.isFunc}"></var-form>
        <div class="add-global" @click="addGlobal">(x)新建全局变量</div>
      </el-tab-pane>
      <el-tab-pane label="图纸选项" name="graphConfig" v-if="graphType==='blank'">Config</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch} from 'vue'
import common from '@/components/common'
import { useStore } from 'vuex'
import VarForm from '@/components/VarForm.vue'

// 接收菜单信息
interface info
{
  name: string,
  label: string,
  unit: string,
  isValue: boolean,
  disptype: number,
  fldValue: { colname: string, dbvalue: number, disp: string, dispc: string }[],
  value:any
}

export default defineComponent({
  components:{ VarForm },
  name: 'CellInfo',
  props:{
    params: {
      type: Object,
      default: ()=>({}),
    }
  },
  setup(props, { expose })
  {
    const store = useStore()
    const global = reactive(common.getGVars())
    const _fld = common.getFlds()
    const _fldvalue = common.getFldValues()
    const actTab = ref<string>('globalVariable')
    const isValue = ref<boolean>(true)
    const graphType = ref<string>('blank')
    const description = reactive({name:'图纸', namec:'电力仿真-画布', icon:'icon-huabu'})
    const configForm:{[key: string]: any} = reactive({})
    const collapseExp:{[key: string]: any} = reactive({
      main:['1', '2'],
      children:['1', '2']
    })
    const attConfig = reactive<info[]>([
      {name:'enable', label: '启用', unit: '', isValue:true, disptype:3, fldValue:[], value:true},
      {name:'outlinelevel', label: '大纲级别', unit: '', isValue:true, disptype:1, fldValue:[], value:0},
    ])
    let fldValue = reactive<info[]>([])
    
    watch(() => props.params, (newValue, oldValue) =>
    {
      graphType.value = newValue.type
      
      if (props.params.type==='blank')
      {
        actTab.value = 'globalVariable'
        description.name = '图纸'
        description.icon = 'icon-huabu'
        description.namec = '电力仿真-画布'
        return
      }
      else if (props.params.type==='edge')
      {
        actTab.value = 'param'
        description.icon = 'icon-xian'
        description.name = '线'
        description.namec = '连接线'
        return
      }
      else
      {
        actTab.value = 'param'
        description.icon = 'icon-node'
        description.name = newValue.data.namec
        description.namec = newValue.data.namec
      }
     
      try
      {
        let temp
        fldValue.length = 0
        const configuration = newValue.data.data.params.Configuration
        Object.keys(configuration).forEach(key =>
        {
          configForm[key] = configuration[key]
          temp = _fld.find(item => item.name === key)
          if (configuration.hasOwnProperty(key)&& temp)
          {
            if (temp.disptype===1)
              fldValue.push({name:key, label: temp.label, unit: temp.unit, isValue:true, disptype:1, fldValue:[], value:''})
            else if (temp.disptype===2)
              fldValue.push({name:key, label: temp.label, unit: temp.unit, isValue:true, disptype:2, fldValue: _fldvalue.filter(item => item.colname === key), value:''})
          }
        })
      }
      catch (error)
      {
        
      }
    })
    const handleClick = () =>
    {
      console.log()
    }
    const addGlobal = ()=>
    {
      global.push({name:'variable_'+(global.length+1), label:'', unit:'', disptype:1, default:'', isFunc:false},)
    }
    // onMounted(() =>
    // {
    //   console.log(props.params)
    // })
    // 暴露方法
    expose({})
    return {
      fldValue,
      actTab,
      configForm,
      isValue,
      handleClick,
      attConfig,
      collapseExp,
      graphType,
      global,
      addGlobal,
      description
    }
  }
})

</script>


