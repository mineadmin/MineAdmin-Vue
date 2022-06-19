import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import globalComponents from '@/components'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'

import '@arco-design/web-vue/dist/arco.css'
import './style/global.scss'
import './style/index.css'
import './style/skin.scss'

import * as maIcons from '@/assets/ma-icons'
import tool from '@/utils/tool'
import * as common from '@/utils/common'
import packageJson from '../package.json'

const app = createApp(App)

app.use(ArcoVue, {})
.use(ArcoVueIcon)
.use(router)
.use(store)
.use(i18n)
.use(globalComponents)

// 注册ma-icon图标
for (let icon in maIcons) {
  app.component(`MaIcon${icon}`, maIcons[icon])
}

app.config.globalProperties.$tool = tool
app.config.globalProperties.$common = common

app.mount('#app')

tool.capsule('MineAdmin', `v${packageJson.version} release`)
console.log('MineAdmin 官网  https://www.mineadmin.com')
console.log('MineAdmin 文档  https://doc.mineadmin.com')
console.log('MineAdmin Gitee https://gitee.com/xmo/MineAdmin')
console.log('MineAdmin-Vue Gitee https://gitee.com/xmo/MineAdmin-Vue')
console.log('请不要吝啬您的 star，谢谢 ~')
