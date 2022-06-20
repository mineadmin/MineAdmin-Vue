import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useTagStore from './modules/tag'
import useKeepAliveStore from './modules/keepAlive'

const pinia = createPinia()

export { useUserStore, useAppStore, useTagStore, useKeepAliveStore }
export default pinia
