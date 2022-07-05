import { useUserStore } from '@/store'

const auth = name => {
  const userStore = useUserStore()
  return userStore.codes && userStore.codes.includes(name)
}

export default auth