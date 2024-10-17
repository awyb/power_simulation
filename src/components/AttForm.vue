<style scoped lang="less">
  /deep/.el-form-item__label { white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:inline; }
  /deep/.el-form-item { margin-bottom:5px; }
  /deep/.el-form-item__content { justify-content: end; }
  /deep/.el-input__suffix-inner { width: 50px;overflow: hidden;justify-content: end;white-space: nowrap;text-overflow: ellipsis; }
  .keyname {font-weight: bold;color: rgb(0, 175, 32);padding:2px; margin-left: 5px;background: var(--color2);font-style: italic;border-radius: 4px;}
  .el-input, .el-select, .el-switch, .el-date, .el-datetime, .el-pick-color {width: 140px;height: 30px;}
  .end-label {font-size: 16px;font-weight: bold;cursor: pointer;margin-left: 5px;height: 30px;margin-right:10px;width: 20px;}
</style>
<template>
  <el-form :label-width="labelWidth">
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
        :style="itemStyle"
        v-model="fld.value"
        :disabled="fld.disabled"
        @focus="onFocus(fld)"
        @blur="onblur(fld)"
        @change="onChange(fld)">
        <template #suffix v-if="showSuffix">
          <span>{{ fld.isval?fld.unit:(fld.focus? calculate(fld.value):'') }}</span>
        </template>
      </el-input>
      <el-select v-else-if="fld.disptype===2"
        class="el-select"
        :style="itemStyle"
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
        :style="itemStyle"
        v-model="fld.value"
        :disabled="fld.disabled"
        :active-text="fld.value?'是':'否'"
        @change="onChange(fld)"/>
      <el-date-picker v-else-if="fld.disptype===4"
        class="el-date"
        :style="itemStyle"
        v-model="fld.value"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="请选择日期"
        @change="onChange(fld)"/>
      <el-date-picker v-else-if="fld.disptype===5"
        class="el-datetime"
        :style="itemStyle"
        v-model="fld.value"
        type="datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择时间"
        @change="onChange(fld)"/>
      <color-picker v-else-if="fld.disptype===6"
        class="el-pick-color"
        :style="itemStyle"
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
/**
 * @author: wyb
 * @date: 2022-08-17
 * @description: 属性表单组件
 *
 * @props:
 * attFlds          [attFld]           属性字段集合
 * language         [string]           语言
 * showTransform    [Boolean]          是否显示转换按钮
 * showDescribe     [Boolean]          是否显示描述
 * labelWidth       [string]           标签的宽度
 * itemStyle        [string]           表单项样式
 * showSuffix       [Boolean]          输入框是否显示后缀
 *
 * @emits:
 * on-change        数据发生改变时触发
 * hidden-classify  触发隐藏分类按钮时触发
 * on-click         点击转换按钮时触发
 */
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
    },
    labelWidth: {
      type: String,
      default: '120px',
    },
    itemStyle: {
      type: Object,
      default: () => ({ width: '140px', height: '30px' }),
    },
    showSuffix: {
      type: Boolean,
      default: true,
    }
  },
  emits:['hidden-classify', 'on-change', 'on-click'],
  setup(props, { emit })
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
    function calculate(val:string)
    {
      try
      {
        return eval(val)
      }
      catch (error)
      {
        return val
      }
      
    }
    // 获取焦点时触发
    function onFocus(fld: attFld)
    {
      fld.focus = true
    }
    // 失去焦点时触发
    function onblur(fld: attFld)
    {
      fld.focus = false
      if (fld.disptype === 3)
        fld.value = ((fld.value.toString()==='true')?true:false)
    }
    // 值改变时触发
    function onChange(fld: attFld)
    {
      parseUfunc(fld)
      emit('on-change', fld)
    }
    // 表达式切换时触发
    function transformFunc(fld: attFld)
    {
      fld.isval = (fld.isval + 1) % 2
      if (fld.isval === 1)
        fld.value = calculate(fld.value)
      emit('on-click', fld)
    }
    return {
      flds,
      onFocus,
      onblur,
      onChange,
      transformFunc,
      calculate
    }
  }
})

</script>


