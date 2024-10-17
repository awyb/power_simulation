import { createI18n } from 'vue-i18n'
// 引入各个语言配置文件
import zh from './zh'
import en from './en'

const i18n = createI18n({
  legacy: false, // Composition API 模式
  globalInjection: true, // 全局注册 $t方法
  locale: 'en',  // 默认显示的语言
  messages: {
    zh,
    en
  }
})
export default i18n
