import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/style/main.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '../public/static/iconfont/icon1/iconfont.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue))

  app.component(key, component)

const debounce = (fn: any, delay: any) =>
{
  let timer: any
  return (...args: any) =>
  {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() =>
    {
      fn(...args)
    }, delay)
  }
}
const resizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends resizeObserver
{
  constructor(callback: any)
  {
    callback = debounce(callback, 200)
    super(callback)
  }
}

app.use(store).use(router).use(ElementPlus).mount('#app')
