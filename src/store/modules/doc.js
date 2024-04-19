import { defineStore } from 'pinia'

const useDocStore = defineStore('doc', {

  state: () => ({
    auth: undefined,
    appId: undefined,
    appSecret: undefined,
    globalParams: undefined,
  }),

  getters: {
    getState() {
      return { ...this.$state }
    },
  },

  actions: {
    setInfo(data) { this.$patch(data) },
  }
})

export default useDocStore