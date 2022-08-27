import { defineStore } from 'pinia'

const useKeepAliveStore = defineStore('keepAlive', {
  state: () => ({
    keepAlives: [],
    show: true
  }),

  getters: {
    currentKeepAlive(state) {
      return { ...state }
    },
  },

  actions: {

    addKeepAlive (component) {
      if (component.path.indexOf('maIframe') > -1) {
        return
      }
      if (! this.keepAlives.includes(component.name)) {
        this.keepAlives.push(component.name)
      }
    },

    removeKeepAlive (component) {
      const idx = this.keepAlives.indexOf(component.name)
      if (idx !== -1) {
        this.keepAlives.splice(idx, 1)
      }
    },

    display () { this.show = true },

    hidden  () { this.show = false },

    clearKeepAlive() { this.keepAlives = [] },
  },
})

export default useKeepAliveStore