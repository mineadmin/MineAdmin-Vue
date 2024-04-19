
import { defineStore } from 'pinia'

let defaultConfig = {
  site_name: 'MineAdmin',
  site_keywords: '',
  site_desc: '',
  site_record_number: '',
  site_copyright: '',
  site_storage_mode: '',
  web_close: '',
}

const useConfigStore = defineStore('config', {
  state: () => ({ ...defaultConfig }),

  getters: {
    appCurrentConfig() {
      return { ...this.$state }
    },
  },

  actions: {
    updateSettings(partial) {
      this.$patch(partial);
    },
  },
})

export default useConfigStore