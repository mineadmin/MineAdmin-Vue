let defaultSetting = {
  mode: 'light',
  tag: true,
  menuCollapse: false,
  menuWidth: 200,
  layout: 'classic',
  skin: 'mine',
  language: 'zh_CN'
}

import { defineStore } from 'pinia'
import tool from '@/utils/tool'

if (! tool.data.get('setting')) {
  tool.data.set('setting', defaultSetting)
} else {
  defaultSetting = tool.data.get('setting')
}

document.body.setAttribute('arco-theme', defaultSetting.mode)

const useAppStore = defineStore('app', {
  state: () => ({ ...defaultSetting }),

  getters: {
    appCurrentSetting(state) {
      return { ...state }
    },
  },

  actions: {
    updateSettings(partial) {
      this.$patch(partial);
    },

    toggleMode(dark) {
      this.mode = dark
      document.body.setAttribute('arco-theme', this.mode)
      defaultSetting.mode = this.mode
      tool.data.set('setting', defaultSetting)
    },

    toggleMenu(status) {
      this.menuCollapse = status
      defaultSetting.menuCollapse = this.menuCollapse
      tool.data.set('setting', defaultSetting)
    },

    toggleTag(status) {
      this.tag = status
      defaultSetting.tag = this.tag
      tool.data.set('setting', defaultSetting)
    },

    changeMenuWidth(width) {
      this.menuWidth = width
      defaultSetting.menuWidth = this.menuWidth
      tool.data.set('setting', defaultSetting)
    },

    changeLayout(layout) {
      this.layout = layout
      defaultSetting.layout = this.layout
      tool.data.set('setting', defaultSetting)
    },

    changeLanguage(language) {
      this.language = language
      defaultSetting.language = this.language
      tool.data.set('setting', defaultSetting)
    },

    useSkin(name) {
      this.skin = name
      defaultSetting.skin = this.skin
      tool.data.set('setting', defaultSetting)
    }
  },
})

export default useAppStore