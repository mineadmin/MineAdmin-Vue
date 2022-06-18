import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import globalComponents from '@/components'
import App from './App.vue'
import router from './router'
import store from './store'
import loadLanguageFile from '@/i18n'
import { useI18n } from 'vue-i18n'

import '@arco-design/web-vue/dist/arco.css'
import './style/global.scss'
import './style/index.css'
import './style/skin.scss'

import * as maIcons from '@/assets/ma-icons'

const app = createApp(App)

app.use(ArcoVue, {}).use(ArcoVueIcon).use(router).use(store).use(loadLanguageFile)

app.use(globalComponents)

// 注册ma-icon图标
for (let icon in maIcons) {
  app.component(`MaIcon${icon}`, maIcons[icon])
}
app.mount('#app')
