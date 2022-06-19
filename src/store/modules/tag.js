import { defineStore } from 'pinia'
import tool from '@/utils/tool'

const defaultTag = [ { name: 'dashboard', title: '仪表盘', path: '/dashboard', affix: true } ]
const useTagStore = defineStore('tag', {
  state: () => ({
    tags: (! tool.local.get('tags') || tool.local.get('tags').length === 0 ) ? defaultTag : tool.local.get('tags')
  }),

  getters: {
    currentTag(state) {
      return { ...state }
    },
  },

  actions: {

    addTag(tag) {
      const target = this.tags.find( item => item.name === tag.name )
      if (! target && tag.name ) {
        this.tags.push(tag)
      }
      this.updateTagsToLocal()
    },

    removeTag(tag) {
      let index = 0
      this.tags.map((item, idx) => {
        if ( item.name === tag.name ) {
          if (idx > 0) {
            index = idx - 1
          } 
          this.tags.splice(idx, 1)
        }
      })
      this.updateTagsToLocal()
      return this.tags[index]
    },

    updateTag(tag) {
      this.tags.map(item => {
        if (item.name == tag.name) {
          item = Object.assign(item, tag)
        }
      })
      this.updateTagsToLocal()
    },

    updateTagTitle(tag, title) {
      state.viewTags.map(item => {
        if (item.name == tag.name) {
          item.customeTitle = title
        }
      })
    },

    updateTagsToLocal() {
      tool.local.set('tags', this.tags)
    },

    clearTags() {
      this.tags = defaultTag
    },
  },
})

export default useTagStore