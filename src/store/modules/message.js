
import { defineStore } from 'pinia'

let defaultType = {
  messageList: [],
}

const useMessageStore = defineStore('message', {
  state: () => ({ ...defaultType }),

  getters: {
    getState() {
      return { ...this.$state }
    },
  },

  actions: {
    updateMessage(partial) {
      this.$patch(partial);
    },
  },
})

export default useMessageStore