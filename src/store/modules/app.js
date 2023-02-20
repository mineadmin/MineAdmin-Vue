let defaultSetting = {
  mode: 'light',
  tag: true,
  menuCollapse: false,
  menuWidth: 230,
  layout: 'classic',
  skin: 'mine',
  i18n: false,
  language: 'zh_CN',
  animation: 'ma-slide-down',
  color: '#165dff',
}

import { defineStore } from 'pinia'
import tool from '@/utils/tool'
import { generate, getRgbStr } from '@arco-design/color'

if (! tool.local.get('setting')) {
  tool.local.set('setting', defaultSetting)
} else {
  defaultSetting = tool.local.get('setting')
}

document.body.setAttribute('arco-theme', defaultSetting.mode)
document.body.setAttribute('mine-skin', defaultSetting.skin)

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
      tool.local.set('setting', defaultSetting)
    },

    toggleMenu(status) {
      this.menuCollapse = status
      defaultSetting.menuCollapse = this.menuCollapse
      tool.local.set('setting', defaultSetting)
    },

    toggleTag(status) {
      this.tag = status
      defaultSetting.tag = this.tag
      tool.local.set('setting', defaultSetting)
    },

    toggleI18n(i18n) {
      this.i18n = i18n
      defaultSetting.i18n = this.i18n
      tool.local.set('setting', defaultSetting)
    },

    changeMenuWidth(width) {
      this.menuWidth = width
      defaultSetting.menuWidth = this.menuWidth
      tool.local.set('setting', defaultSetting)
    },

    changeLayout(layout) {
      this.layout = layout
      defaultSetting.layout = this.layout
      tool.local.set('setting', defaultSetting)
    },

    changeLanguage(language) {
      this.language = language
      defaultSetting.language = this.language
      tool.local.set('setting', defaultSetting)
      window.location.reload()
    },

    changeColor(color) {
      if (!/^#[0-9A-Za-z]{6}/.test(color)) return
      this.color = color
      const list = generate(this.color, { list: true, dark: this.mode === 'dark' })
      list.forEach((color, index) => {
        const rgbStr = getRgbStr(color)
        document.body.style.setProperty(`--primary-${index + 1}`, rgbStr)
        document.body.style.setProperty(`--arcoblue-${index + 1}`, rgbStr)
      })
      defaultSetting.color = this.color
      tool.local.set('setting', defaultSetting)
    },

    changeAnimation(name) {
      this.animation = name
      defaultSetting.animation = this.animation
      tool.local.set('setting', defaultSetting)
    },

    useSkin(name) {
      this.skin = name
      defaultSetting.skin = this.skin
      document.body.setAttribute('mine-skin', this.skin)
      tool.local.set('setting', defaultSetting)
    }
  },
})

export default useAppStore