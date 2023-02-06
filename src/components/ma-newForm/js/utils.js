import tool from '@/utils/tool.js'
import { isEmpty, isFunction, get } from 'lodash'

export const containerItems = ['tabs', 'table', 'card', 'grid', 'grid-tailwind']
export const inputType      = ['input', 'input-password', 'input-search']

export const interactiveControl = (form, columns) => {
  const obj = []
  for (let name in form) {
    columns.map( item => {
      if (item.dataIndex === name && item.control && isFunction(item.control)) {
        obj.push(item.control(get(form, name)))
      }
    })
  }
  obj.map(changItem => {
    columns.map( (item, idx) => {
      for (let name in changItem) {
        if (name == item.dataIndex) {
          columns[idx] = Object.assign(item, changItem[name] || {})
        }
      }
    })
  })
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