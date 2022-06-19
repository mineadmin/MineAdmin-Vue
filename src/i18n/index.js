import { createI18n } from 'vue-i18n'
import tool from '@/utils/tool'

const setting = tool.local.get('setting')

const getLanguage = () => {
  const loadFile = () => {
    if (setting.language === 'zh_CN') {
      return import.meta.globEager('./zh_CN/*.js')
    } else if (setting.language === 'en') {
      return import.meta.globEager('./en/*.js')
    }
  }

  const files = loadFile()

  const messages = { [setting.language]: {} }

  for (let path in files) {
    const name = path.match(/([A-Za-z0-9_]+)/g)[1]
    if (files[path].default) {
      messages[setting.language][name] = files[path].default
    }
  }
  return messages
}

const i18n = createI18n({
  locale: setting.language,
  legacy: false,
  globalInjection: true,
  fallbackLocale: 'zh_CN',
  messages: getLanguage()
})

export default i18n