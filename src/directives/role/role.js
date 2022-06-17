import { useUserStore } from '@/store'

const role = name => {
  const userStore = useUserStore()
  return userStore.permission.includes(name)
}

export default role