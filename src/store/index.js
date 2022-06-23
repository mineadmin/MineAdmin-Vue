import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useTagStore from './modules/tag'
import useKeepAliveStore from './modules/keepAlive'
import useConfigStore from './modules/config'

const pinia = createPinia()

export { useUserStore, useAppStore, useTagStore, useKeepAliveStore, useConfigStore }
export default pinia
