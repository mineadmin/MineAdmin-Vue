import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useTagStore from './modules/tag'
import useKeepAliveStore from './modules/keepAlive'
import useIframeStore from './modules/iframe'
import useConfigStore from './modules/config'
import useDocStore from './modules/doc'

const pinia = createPinia()

export {
  useUserStore,
  useAppStore,
  useTagStore,
  useKeepAliveStore,
  useIframeStore,
  useConfigStore,
  useDocStore
}
export default pinia
