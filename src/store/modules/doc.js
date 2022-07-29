import { defineStore } from 'pinia'

const useDocStore = defineStore('doc', {

  state: () => ({
    auth: undefined,
    appId: undefined,
    appSecret: undefined,
    globalQuery: undefined,
    globalHeader: undefined,
    globalBody: undefined,
  }),

  getters: {
    setDoc(state) {
      return { ...state };
    },
  },

  actions: {
    setInfo(data) { this.$patch(data) },
  }
})

export default useDocStore