import { createI18n } from 'vue-i18n'
import tool from '@/utils/tool'

const setting = tool.local.get('setting')

const getLanguage = () => {
  const loadFile = () => {
    if (setting.language === 'zh_CN') {
      return import.meta.glob('./zh_CN/**/*.js', { eager:true })
    } else if (setting.language === 'en') {
      return import.meta.glob('./en/**/*.js', { eager:true })
    }
  }

  const generateLanguage = (fileNames, fileContent, generateLanguages = {}) => {
    const fileName = fileNames.shift()
    if (fileNames.length > 0) {
      if (typeof generateLanguages[fileName] == 'undefined') {
        generateLanguages[fileName] = {}
      }
      generateLanguages[fileName] = generateLanguage(fileNames, fileContent, generateLanguages[fileName])
    }else{
      generateLanguages[fileName] = fileContent
    }
    return generateLanguages
  }

  const files = loadFile()
  let messages = { [setting.language]: {} }
  for (let path in files) {
    const names = path.match(/([A-Za-z0-9_]+)/g)
    //去除语言文件夹和文件后缀名
    names.shift()
    names.pop()
    if (files[path].default) {
      messages[setting.language] = generateLanguage(names, files[path].default, messages[setting.language])
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