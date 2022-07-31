
import { defineStore } from 'pinia'

let defaultType = {
  messageList: [],
}

const useMessageStore = defineStore('message', {
  state: () => ({ ...defaultType }),

  getters: {
    appCurrentMessage(state) {
      return { ...state }
    },
  },

  actions: {
    updateMessage(partial) {
      this.$patch(partial);
    },
  },
})

export default useMessageStore