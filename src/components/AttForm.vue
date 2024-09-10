<style scoped lang="less">
  /deep/.el-form-item__label {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline;}
  /deep/.el-form-item{margin-bottom:5px;}
  /deep/.el-form-item__content{justify-content: end;}
  /deep/.el-input__suffix-inner{width: 30px;overflow: hidden;}
  .keyname{font-weight: bold;color: green;padding:2px; margin-left: 5px;background: rgb(233, 233, 233);font-style: italic;border-radius: 4px;}
  .el-input, .el-select, .el-switch {width: 140px;height: 30px;}
  .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;margin-right:10px;width: 20px;}
</style>
<template>
  <el-form label-width="120px">
    <el-form-item :label="fld.namec" v-for="(fld,index) in flds" :key="index">
      <template #label>
        <el-tooltip :content="fld.describe" placement="left" effect="light">
          <template #content >
            <span style="font-weight: bold;">{{fld.name}}</span>
            <span class="keyname" v-if="fld.keyname">{{fld.keyname}}</span>
            <span v-if="fld.unit" style="margin-left: 5px;">[{{fld.unit}}]</span>
            <hr />
            <span>{{fld.namec}}</span>
            <br />
            <span>{{fld.describe}}</span>
          </template>
          <span :style="{color:fld.disabled?'var(--el-disabled-text-color)':'var(--el-text-color-regular)'}">{{fld.name}}</span>
        </el-tooltip>
      </template>
      <el-input v-if="fld.disptype===1||!fld.isval" v-model="fld.value" :disabled="fld.disabled" class="el-input" @focus="onFocus(fld)" @blur="onblur(fld)">
        <template #suffix>{{ fld.isval?fld.unit:(fld.focus?fld.value:'') }}</template>
      </el-input>
      <el-select v-else-if="fld.disptype===2" v-model="fld.value" :disabled="fld.disabled" class="el-select" @change="onChange(fld)">
        <el-option
          v-for="(sel,i) in fld.fldvalue"
          :label="sel.disp"
          :value="sel.dbvalue"
          :key="i"
        />
      </el-select>
      <el-switch v-else-if="fld.disptype===3" v-model="fld.value" :disabled="fld.disabled" :active-text="fld.value?'是':'否'" class="el-switch"/>
      <label :style="{color:fld.disabled?'var(--el-disabled-text-color)':'var(--el-text-color-regular)'}" class="end-label" @click="fld.isval = (fld.isval+1)%2" v-html="fld.isval?'(x)':'ƒ<sub>x</sub>'"></label>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch } from 'vue'
import { attFld } from '@/components/interface/interfaceBase'

import eveBus from '@/components/ts/eveBus'
export default defineComponent({
  name: 'VarForm',
  props:{
    attFlds: {
      type: Array as ()=>Array<attFld>,
      default: ()=>([]),
    }
  },
  emits:['hidden-classify'],
  setup(props, { expose, emit })
  {
    const flds = reactive(props.attFlds)
    flds.forEach(fld =>
    {
      parseUfunc(fld)
    })
    function parseUfunc(fld: attFld)
    {
      if (fld.ufunc&&Array.isArray(fld.ufunc) )
      {
        fld.ufunc.forEach((func)=>
        {
          if (func.type === 'disabled-fld')
          {
            const disabledIds = func.args[fld.value+'']
            if (disabledIds)
            {
              flds.forEach(fld=>
              {
                if (disabledIds.includes(fld.id))
                  fld.disabled = true
                else
                  fld.disabled = false
              })
            }
            else
            {
              flds.forEach(fld=>
              {
                fld.disabled = false
              })
            }
          }
          else if (func.type === 'hidden-classify')
          {
            const hiddenClassify = func.args[fld.value + '']
            emit('hidden-classify', hiddenClassify)
          }
        })
      }
    }
    function onFocus(fld: attFld)
    {
      fld.focus = true
    }
    function onblur(fld: attFld)
    {
      fld.focus = false
      if (fld.disptype === 3)
        fld.value = ((fld.value.toString()==='true')?true:false)
    }
    function onChange(fld: attFld)
    {
      parseUfunc(fld)
      
    }
    expose({})
    return {
      flds,
      onFocus,
      onblur,
      onChange
    }
  }
})

</script>


