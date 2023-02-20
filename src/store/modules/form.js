
import { defineStore } from 'pinia'

let defaultConfig = {
  formList: [],
}

const useFormStore = defineStore('form', {
  state: () => ({ ...defaultConfig }),

  getters: {
    appCurrentConfig(state) {
      return { ...state }
    },
  },

  actions: {
    updateSettings(partial) {
      this.$patch(partial);
    },
  },
})

export default useFormStore