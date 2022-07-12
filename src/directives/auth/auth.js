import { useUserStore } from '@/store'

const auth = name => {
  const userStore = useUserStore()
  return (userStore.codes && userStore.codes.includes(name)) || (userStore.codes && userStore.codes.includes('*'))
}

export default auth