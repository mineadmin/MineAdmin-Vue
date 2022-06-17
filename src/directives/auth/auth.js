import { useUserStore } from '@/store'

const auth = name => {
  const userStore = useUserStore()
  return userStore.permission.includes(name)
}

export default auth