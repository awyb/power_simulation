<style scoped lang="less">
  .cell-info {
    .info-tabs {
      .el-input, .el-select {width: 150px;height: 32px;}
      .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 32px;}
    }
  }
  /deep/.el-form-item__label{
	white-space:nowrap;
	overflow:hidden;
	text-overflow:ellipsis;
	display:inline;
}

</style>
<template>
  <div class="cell-info">
    <el-tabs v-model="actTab" class="info-tabs" @tab-click="handleClick">
      <el-tab-pane label="参数" name="param">
        <el-form :model="configForm" label-width="120px" style="width: 300px;padding: 30px;">
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
      </el-tab-pane>
      <el-tab-pane label="格式" name="format">Config</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch} from 'vue'
import common from '@/components/common'
// 接收菜单信息
interface info
{
  name: string,
  label: string,
  unit: string,
  isValue: boolean,
  disptype: number,
  fldValue: { colname: string, dbvalue: number, disp: string, dispc: string }[]
}

export default defineComponent({
  name: 'CellInfo',
  props:{
    params: {
      type: Object,
      default: ()=>({}),
    }
  },
  setup(props, { expose })
  {
    const _fld = common.getFlds()
    const _fldvalue = common.getFldValues()
    let fldValue = reactive<info[]>([])
    const actTab = ref<string>('param')
    const isValue = ref<boolean>(true)
    const configForm:{[key: string]: any} = reactive({})
    watch(() => props.params, (newValue, oldValue) =>
    {
     
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
              fldValue.push({name:key, label: temp.label, unit: temp.unit, isValue:true, disptype:1, fldValue:[]})
            else if (temp.disptype===2)
              fldValue.push({name:key, label: temp.label, unit: temp.unit, isValue:true, disptype:2, fldValue: _fldvalue.filter(item => item.colname === key)})
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
      handleClick
    }
  }
})

</script>


