import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useTagStore from './modules/tag'
import useKeepAliveStore from './modules/keepAlive'
import useIframeStore from './modules/iframe'
import useConfigStore from './modules/config'

const pinia = createPinia()

export { useUserStore, useAppStore, useTagStore, useKeepAliveStore, useIframeStore, useConfigStore }
export default pinia
