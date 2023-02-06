import tool from '@/utils/tool.js'
import { isEmpty } from 'lodash'

export const containerItems = ['tabs', 'table', 'card', 'grid', 'grid-tailwind']
export const inputType = ['input', 'input-password', 'input-search']

export const generateId = (name) => {
  return `Ma_${name}_${tool.generateId()}`
}

export const addRef = (refList, name) => {
  refList.push(name)
}

export const upperCaseFirst = (str) => {
  if (isEmpty(str)) return ''
  return str[0].toUpperCase() + str.substr(1)
}

export const toHump = (str) => {
  let temp = str[0].toUpperCase()
  let step = 1
  while(str.indexOf('-') > -1) {
    let index = str.indexOf('-')
    temp += str.substring(step, index)
    temp += str[index + 1].toUpperCase()
    str = str.replace('-', '')
    step = index + 1
  }
  temp += str.substring(step)
  return temp
}

export const getComponentName = (formType) => {
  if (containerItems.includes(formType)) {
    return `Ma${toHump(formType)}`
  }
  if (inputType.includes(formType)) {
    return 'MaFormInput'
  }
  return (`MaForm${toHump(formType)}`)
}