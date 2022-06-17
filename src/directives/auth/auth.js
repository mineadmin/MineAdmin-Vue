import { useUserStore } from '@/store'

const auth = name => {
  const userStore = useUserStore()
  return userStore.codes.includes(name)
}

export default auth