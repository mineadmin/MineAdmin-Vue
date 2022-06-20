import { defineStore } from 'pinia'

const useKeepAliveStore = defineStore('keepAlive', {
  state: () => ({
    keepAlives: [],
    name: null,
    show: true
  }),

  getters: {
    currentKeepAlive(state) {
      return { ...state }
    },
  },

  actions: {

    addKeepAlive (component) {
      if (! this.keepAlives.includes(component)) {
        this.keepAlives.push(component)
      }
    },

    removeKeepAlive (component) {
      const idx = this.keepAlives.indexOf(component)
      if (idx !== -1) {
        this.keepAlives.splice(idx, 1)
      }
    },

    display () { this.show = true },

    hidden  () { this.show = false },

    setName (name) { this.name = name },

    clearKeepAlive() { this.keepAlives = [] },
  },
})

export default useKeepAliveStore