<style scoped lang="less">
  /deep/.el-form-item__label {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline;}
  /deep/.el-form-item{margin-bottom:5px;}
  /deep/.el-form-item__content{justify-content: end;}
  /deep/.el-input__suffix-inner{width: 50px;overflow: hidden;justify-content: end;}
  .keyname{font-weight: bold;color: rgb(0, 175, 32);padding:2px; margin-left: 5px;background: rgb(233, 233, 233);font-style: italic;border-radius: 4px;}
  .el-input, .el-select, .el-switch, .el-date, .el-datetime, .el-pick-color {width: 140px;height: 30px;}
  .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;margin-right:10px;width: 20px;}
</style>
<template>
  <el-form label-width="120px">
    <el-form-item :label="fld.namec" v-for="(fld,index) in flds" :key="index">
      <template #label>
        <el-tooltip v-if="showDescrible" :content="fld.describe" placement="left" effect="light">
          <template #content >
            <span style="font-weight: bold;">{{ language === 'en'?fld.name:fld.namec }}</span>
            <span class="keyname" v-if="fld.keyname">{{fld.keyname}}</span>
            <span v-if="fld.unit" style="margin-left: 5px;">[{{fld.unit}}]</span>
            <hr />
            <span>{{ language === 'en'?fld.namec:fld.name }}</span>
            <br />
            <span>{{fld.describe}}</span>
          </template>
          <span :style="{color:fld.disabled?'var(--el-disabled-text-color)':'var(--el-text-color-regular)'}">
            {{ language === 'en'?fld.name:fld.namec }}
          </span>
        </el-tooltip>
        <span v-else :style="{color:fld.disabled?'var(--el-disabled-text-color)':'var(--el-text-color-regular)'}">
          {{ language === 'en'?fld.name:fld.namec }}
        </span>
      </template>
      <el-input v-if="fld.disptype===1||!fld.isval"
        class="el-input"
        v-model="fld.value"
        :disabled="fld.disabled"
        @focus="onFocus(fld)"
        @blur="onblur(fld)"
        @change="onChange(fld)">
        <template #suffix>
          {{ fld.isval?fld.unit:(fld.focus?fld.value:'') }}
        </template>
      </el-input>
      <el-select v-else-if="fld.disptype===2"
        class="el-select"
        v-model="fld.value"
        :disabled="fld.disabled"
        @change="onChange(fld)">
        <el-option v-for="(sel,i) in fld.fldvalue"
          :label="language === 'en'?sel.disp:sel.dispc"
          :value="sel.dbvalue"
          :key="i">
          <template #default>
            <el-tooltip :content="language === 'en'?sel.dispc:sel.disp" placement="left" effect="light">
              <template #content >
                <span style="padding: 20px;">{{ language === 'en'?sel.dispc:sel.disp }}</span>
              </template>
              {{ language === 'en'?sel.disp:sel.dispc }}
            </el-tooltip>
          </template>
        </el-option>
      </el-select>
      <el-switch v-else-if="fld.disptype===3"
        class="el-switch"
        v-model="fld.value"
        :disabled="fld.disabled"
        :active-text="fld.value?'是':'否'"
        @change="onChange(fld)"/>
      <el-date-picker v-else-if="fld.disptype===4"
        class="el-date"
        v-model="fld.value"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="请选择日期"
        @change="onChange(fld)"/>
      <el-date-picker v-else-if="fld.disptype===5"
        class="el-datetime"
        v-model="fld.value"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择时间"
        @change="onChange(fld)"/>
      <color-picker v-else-if="fld.disptype===6"
        class="el-pick-color"
        v-model="fld.value"
        :defaultColor="'#ffffff'"
        @change="onChange(fld)"/>
      <label v-if="showTransform"
        class="end-label"
        v-html="fld.isval?'(x)':'ƒ<sub>x</sub>'"
        :style="{color:fld.disabled?'var(--el-disabled-text-color)':'var(--el-text-color-regular)'}"
        @click="transformFunc(fld)"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue'
import { attFld } from '@/components/interface/interfaceBase'
import common from './ts/common'

export default defineComponent({
  name: 'VarForm',
  props:{
    attFlds: {
      type: Array as ()=>Array<attFld>,
      default: ()=>([]),
    },
    language: {
      type: String,
      default: 'en',
    },
    showTransform: {
      type: Boolean,
      default: true,
    },
    showDescrible: {
      type: Boolean,
      default: true,
    }
  },
  emits:['hidden-classify', 'on-change', 'on-click'],
  setup(props, { expose, emit })
  {
    const flds = reactive(props.attFlds)
    const funcs:{ [key:string]:(val:any)=>void } = common.globalFunc()
    flds.forEach(fld =>
    {
      parseUfunc(fld)
    })
    // 解析数据改变触发函数
    function parseUfunc(fld: attFld)
    {
      if (fld.ufunc&&Array.isArray(fld.ufunc)) // 解析字段函数
      {
        fld.ufunc.forEach((func)=>
        {
          if (func.type === 'disabled-fld') // 禁用字段
          {
            const disabledIds = func.args[fld.value+'']
            if (disabledIds) // 存在禁用字段
            {
              flds.forEach(fld=>
              {
                if (disabledIds.includes(fld.id)) // 禁用字段
                  fld.disabled = true
                else // 启用字段
                  fld.disabled = false
              })
            }
            else // 不存在禁用字段
            {
              flds.forEach(fld=>
              {
                fld.disabled = false
              })
            }
          }
          else if (func.type === 'hidden-classify') // 隐藏分类
          {
            const hiddenClassify = func.args[fld.value + '']
            emit('hidden-classify', hiddenClassify)
          }
          else if (func.type === 'function') // 执行函数
          {
            const funcName = func.args.name
            if (typeof funcs[funcName] === 'function')
              funcs[funcName](fld.value)
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
      emit('on-change', fld)
    }
    function transformFunc(fld: attFld)
    {
      fld.isval = (fld.isval + 1) % 2
      emit('on-click', fld)
    }
    expose({})
    return {
      flds,
      onFocus,
      onblur,
      onChange,
      transformFunc
    }
  }
})

</script>


