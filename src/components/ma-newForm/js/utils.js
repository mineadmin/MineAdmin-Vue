import tool from '@/utils/tool.js'

export const containerItems = ['tabs', 'table', 'card', 'grid']
export const inputType = ['input', 'input-password', 'input-search', 'input-number']

export const generateId = (name) => {
  return `Ma_${name}_${tool.generateId()}`
}

export const upperCaseFirst = (str) => {
  return str[0].toUpperCase() + str.substr(1)
}

export const getComponentName = (formType) => {
  if (containerItems.includes(formType)) {
    return `Ma${upperCaseFirst(formType)}`
  }
  if (inputType.includes(formType)) {
    return 'MaForminput'
  }
  return (`MaForm${upperCaseFirst(formType)}`).replace('-', '')
}