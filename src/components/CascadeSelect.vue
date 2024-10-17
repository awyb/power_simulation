<template>
  <el-cascader-panel style="width: fit-content" :options="options" @change="handleChange" />
</template>
<script lang="ts" setup>
import { DarkTheme } from '../../public/static/themes/DarkTheme'
import { LightTheme } from '../../public/static/themes/LightTheme'
const funcs:{ [key: string]: any } = {
  'zh': () =>
  {
    console.log('zh')
  },
  'en': () =>
  {
    console.log('en')
  },
  'select-dark': () =>
  {
    for (let key in DarkTheme)
      document.documentElement.style.setProperty(`${key}`, DarkTheme[key])

  },
  'select-light': () =>
  {
    for (let key in LightTheme)
      document.documentElement.style.setProperty(`${key}`, LightTheme[key])
  }

}
function handleChange(value: any)
{

  if (value.length&& funcs[value[value.length - 1]] instanceof Function)
    funcs[value[value.length - 1]]()
}
const options = [
  {
    value: 'change-language',
    label: '语言切换',
    children: [
      {
        value: 'zh',
        label: '中文',
        func: () =>
        {
          console.log('中文')
        }
      },
      {
        value: 'en',
        label: 'English',
        func: () =>
        {
          console.log('English')
        }
      },
    ],
  },
  {
    value: 'change-theme',
    label: '主题切换',
    children: [
      {
        value: 'select-dark',
        label: 'Dark'
      },
      {
        value: 'select-light',
        label: 'Light'
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    
  },
]
</script>