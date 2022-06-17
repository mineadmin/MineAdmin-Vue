import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useTagStore from './modules/tag'

const pinia = createPinia()

export { useUserStore, useAppStore, useTagStore }
export default pinia
