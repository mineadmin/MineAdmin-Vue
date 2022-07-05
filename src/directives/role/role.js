import { useUserStore } from '@/store'

const role = name => {
  const userStore = useUserStore()
  return userStore.roles && userStore.roles.includes(name)
}

export default role