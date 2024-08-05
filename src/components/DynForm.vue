<style scoped lang="less">
  .form-container {display: flex;align-items: center;margin:5px;
    /deep/.el-form-item__label {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline;}
    /deep/.colorBtn{box-shadow: 1px 1px 1px 1px #5b5b5b;}
    /deep/.box{top: 0;right: 0;}
    /deep/.el-form-item__content {justify-content: space-between;}
    /deep/.el-date-editor{width: 150px;}
    .el-com{width: 150px !important;height: 30px;}
    .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;}
    .el-pick-color{display: contents;}
  }
</style>
<template>
  <div class="form-container">
    <el-form :model="configForm" label-width="120px" style="width: 300px;padding: 10px 20px;">
      <el-form-item :label="item.label" v-for="(item,index) in flds" :key="index">
        <template #label="{label}">
          <el-tooltip :content="label" placement="left">
            <span>{{label}}</span>
          </el-tooltip>
        </template>
        <el-input v-if="item.disptype===1||!item.isValue" v-model="configForm[item.name]" class="el-input el-com" @change="onChange(item)">
          <template v-if="item.isValue" #suffix>{{ item.unit }}</template>
        </el-input>
        <el-select v-else-if="item.disptype===2" v-model="configForm[item.name]"  placeholder="请选择" class="el-select el-com" @change="onChange(item)">
          <el-option
            v-for="(sel,i) in item.fldValue"
            :label="sel.dispc"
            :value="sel.dbvalue"
            :key="i"
          />
        </el-select>
        <el-date-picker class="el-date el-com"
          v-else-if="item.disptype===3"
          v-model="configForm[item.name]"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
          @change="onChange(item)"/>
        <el-date-picker class="el-datetime el-com"
          v-else-if="item.disptype===4"
          v-model="configForm[item.name]"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择时间"
          @change="onChange(item)"/>
        <el-switch class="el-switch el-com"
          v-else-if="item.disptype===5"
          v-model="configForm[item.name]"
          :active-text="configForm[item.name]?'是':'否'"
          @change="onChange(item)"/>
        <color-picker class="el-pick-color el-com"
          v-else-if="item.disptype===6"
          v-model="configForm[item.name]"
          :defaultColor="'#ffffff'"
          @change="onChange(item)"/>
        <label class="end-label" v-if="item.expression" @click="item.isValue=!item.isValue" v-html="item.isValue?'(x)':'ƒ<sub>x</sub>'"></label>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue'

interface fldConfig
{
  name: string,
  label: string,
  unit: string,
  isValue: boolean,
  disptype: number,
  fldValue: { colname: string, dbvalue: number, disp: string, dispc: string }[],
  value:any,
  expression:any
}
export default defineComponent({
  name: 'DynForm',
  props:{
    params: {
      type: Object,
      default: ()=>({name:'', value:'', unit:'', isValue:true}),
    }
  },
  setup(props, { expose })
  {
    0.
    const onChange = (args:any) =>
    {
      if (args.callback)
        args.callback(configForm[args.name])
    }
    const params = reactive(props.params)
    const configForm:{[key: string]: any} = reactive({})
    const flds = reactive<fldConfig[]>(params.flds)
    const resolve = params.form
    flds.forEach(fld=>
    {
      configForm[fld.name] = resolve[fld.name]||fld.value
    })
    expose({})
    return {
      configForm,
      flds,
      onChange
    }
  }
})

</script>


