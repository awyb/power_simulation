<style scoped lang="less">

</style>
<template>
  <div class="cell-info">
    <el-tabs v-model="actTab" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="参数" name="param">
        <el-form :model="configForm" label-width="120px" style="width: 350px;">
          <el-form-item :label="item.label" v-for="(item,index) in fldValue" :key="index">
            <el-input v-model="configForm[item.name]" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="格式" name="format">Config</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch} from 'vue'
// 接收菜单信息
interface info
{
  name: string,
  label: string
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
    const _fld = [
      {name:'Name', label:'名称'},
      {name:'Rated Frequency', label:'额定频率'},
      {name:'Rated Voltage (L-L, RMS)', label:'额定电压'},
      {name:'Input Capacity', label:'输入容量'}
    ]
    let fldValue = reactive<info[]>([])
    const actTab = ref<string>('param')
    const configForm:{[key: string]: any} = reactive({})
    watch(() => props.params, (newValue, oldValue) =>
    {
     
      try
      {
        fldValue.length = 0
        const configuration = newValue.data.data.params.Configuration
        Object.keys(configuration).forEach(key =>
        {
          configForm[key] = configuration[key]
          if (configuration.hasOwnProperty(key))
            fldValue.push({name:key, label: _fld.find(item => item.name === key)?.label||''})
        })
      }
      catch (error)
      {
        
      }
    })
    // onMounted(() =>
    // {
    //   console.log(props.params)
    // })
    // 暴露方法
    expose({})
    return {
      fldValue,
      actTab,
      configForm
    }
  }
})

</script>


