import { createPinia } from 'pinia'
import useUserStore from './user'
import useAppStore from './app'
import useTagStore from './tag'

const pinia = createPinia()

export { useUserStore, useAppStore, useTagStore }
export default pinia
