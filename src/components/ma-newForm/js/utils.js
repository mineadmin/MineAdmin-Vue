import tool from '@/utils/tool.js'

export const generateId = (name) => {
  return `Ma_${name}_${tool.generateId()}`
}

export const getComponentName = (formType) => {
  const maComponentList = ['tabs', 'table', 'card', 'grid']
  if (maComponentList.includes(formType)) {
    return `Ma${formType[0].toUpperCase() + formType.substr(1)}`
  }
  return formType
}