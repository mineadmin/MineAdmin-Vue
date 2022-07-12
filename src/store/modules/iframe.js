import { defineStore } from 'pinia'

const useIframeStore = defineStore('iframe', {
  state: () => ({
    iframes: [],
    name: null,
    show: true
  }),

  getters: {
    currentIframe(state) {
      return { ...state }
    },
  },

  actions: {

    addIframe (component) {
      if (! this.iframes.includes(component)) {
        this.iframes.push(component)
      }
    },

    removeIframe (component) {
      const idx = this.iframes.indexOf(component)
      if (idx !== -1) {
        this.iframes.splice(idx, 1)
      }
    },

    display () { this.show = true },

    hidden  () { this.show = false },

    setName (name) { this.name = name },

    clearIframe() { this.iframes = [] },
  },
})

export default useIframeStore