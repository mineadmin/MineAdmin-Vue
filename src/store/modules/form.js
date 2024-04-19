
import { defineStore } from 'pinia'

let defaultConfig = {
  formList: [],
  crudList: {},
}

const useFormStore = defineStore('form', {
  state: () => ({ ...defaultConfig }),

  getters: {
    getState() {
      return { ...this.$state }
    },
  },

  actions: {
    updateSettings(partial) {
      this.$patch(partial);
    },
  },
})

export default useFormStore