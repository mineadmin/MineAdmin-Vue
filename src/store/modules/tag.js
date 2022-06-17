import { defineStore } from 'pinia'

const useTagStore = defineStore('tag', {
  state: () => ({
    tags:  [ { path: '/dashboard', title: '仪表盘', affix: true } ]
  }),

  getters: {
    tagCurrentSetting(state) {
      return { ...state }
    },
  },

  actions: {
    updateSettings(partial) {
      this.$patch(partial);
    },

    addTag(tagRoute) {
      const target = this.tags.find(item => item.path === tagRoute.path)
      if (!target && tagRoute.title) {
        this.tags.push(tagRoute)
      }
    },

    removeTag(tagRoute) {
      this.tags.map((item, index) => {
        if (item.path === tagRoute.path) {
          this.tags.splice(index, 1)
        }
      })
    },

    updateTag(tagRoute) {
      this.tags.map(item => {
        if (item.path == route.path) {
          item = Object.assign(item, tagRoute)
        }
      })
    },

    updateTagTitle(title = '') {
      const nowFullPath = location.hash.substring(1)
      state.viewTags.map(item => {
        if (item.path == nowFullPath) {
          item.title = title
        }
      })
    },

    clearTags() {
      this.tags = [ { path: '/dashboard', title: '仪表盘', affix: true } ]
    },
  },
})

export default useTagStore