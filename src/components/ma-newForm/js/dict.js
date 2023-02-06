import { isArray, isFunction } from 'lodash'
import { request } from '@/utils/request'
import commonApi from '@/api/common'

export const allowUseDictComponent = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'tree-select', 'cascader']
export const allowCoverComponent = ['radio', 'checkbox', 'select', 'transfer']
export const allowCascaderComponent = ['radio', 'checkbox', 'select']
export const arrayComponentDefault = ['checkbox', 'user-select', 'children-form']

export const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })

export const handlerDictProps = (item, tmpArr) => {
  let data = []
  let tran = {}
  let labelName = 'label'
  let valueName = 'value'
  if (item.dict.name && (!item.dict.url || !item.dict.data)) {
    labelName = 'title'
    valueName = 'key'
  }
  if (allowUseDictComponent.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = dicItem[(item.dict.props && item.dict.props.label) || labelName]
      let tmp = dicItem[(item.dict.props && item.dict.props.value) || valueName]
      let value
      if (tmp === 'true') value = true
      else if (tmp === 'false') value = false
      else if (typeof tmp == 'Number') value = tmp
      else value = tmp + ''
      tran[value] = label
      return { label, value }
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  return data
}

export const loadDict = async (dictList, item) => {
  if (allowUseDictComponent.includes(item.formType)) {
    if (item.dict.name) {
      const response = await commonApi.getDict(item.dict.name)
      if (response.data) {
        dictList[item.dataIndex] = handlerDictProps(item, response.data)
      }
    } else if (item.dict.url) {
      const response = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.body || {})
      if (response.data) {
        dictList[item.dataIndex] = handlerDictProps(item, response.data)
      }
    } else if (item.dict.data) {
      if (isArray(item.dict.data)) {
        dictList[item.dataIndex] = handlerDictProps(item, item.dict.data)
      } else if (isFunction(item.dict.data)) {
        const response = await item.dict.data()
        dictList[item.dataIndex] = handlerDictProps(item, response)
      }
    }
  }
}