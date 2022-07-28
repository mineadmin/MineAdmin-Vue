import { defineStore } from 'pinia'
import apiDoc from '@/api/apiDoc'
import tool from '@/utils/tool'

const useDocStore = defineStore('doc', {

  state: () => ({
    auth: undefined,
    appid: undefined,
    appsecret: undefined,
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