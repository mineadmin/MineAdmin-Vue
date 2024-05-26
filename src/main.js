import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import globalComponents from '@/components'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import directives from './directives'
import dayjs from 'dayjs'
import zhCn from 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale(zhCn)
dayjs.extend(relativeTime)

// 官方样式
// import '@arco-design/web-vue/dist/arco.css'
// MineAdmin-V2样式
import '@arco-themes/vue-mine-admin-v2/index.less'
import './style/skin.less'
import './style/index.css'
import './style/global.less'

import tool from '@/utils/tool'
import * as common from '@/utils/common'
import packageJson from '../package.json'

const app = createApp(App)

app.use(ArcoVue, {})
.use(ArcoVueIcon)
.use(router)
.use(store)
.use(i18n)
.use(directives)
.use(globalComponents)

// 注册ma-icon图标
const modules = import.meta.glob('./assets/ma-icons/*.vue', { eager: true })
for (const path in modules) {
  const name = path.match(/([A-Za-z0-9_-]+)/g)[2]
  const componentName = `MaIcon${name}`
  app.component(componentName, modules[path].default)
}

app.config.globalProperties.$tool = tool
app.config.globalProperties.$common = common
app.config.globalProperties.$title = import.meta.env.VITE_APP_TITLE
app.config.globalProperties.$url = import.meta.env.VITE_APP_BASE

app.mount('#app')

tool.capsule('MineAdmin', `v${packageJson.version} release`)
console.log('MineAdmin 官网  https://www.mineadmin.com')
console.log('MineAdmin 文档  https://doc.mineadmin.com')
console.log('MineAdmin Github https://github.com/kanyxmo/MineAdmin')
console.log('MineAdmin-Vue Github https://github.com/kanyxmo/MineAdmin-Vue')
console.log('请不要吝啬您的 star，谢谢 ~ 🤩🤩🤩')