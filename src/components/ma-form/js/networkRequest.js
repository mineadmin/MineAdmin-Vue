import { isArray, isFunction, set } from 'lodash'
import { request } from '@/utils/request'
import commonApi from '@/api/common'
import tool from '@/utils/tool'

export const allowUseDictComponent  = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'tree-select', 'cascader']
export const allowCoverComponent    = ['radio', 'checkbox', 'select', 'transfer', 'cascader']

export const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })

export const handlerDictProps = (item, tmpArr) => {
  let data = []
  let tran = {}
  let colors = {}
  let labelName = 'label'
  let valueName = 'value'
  if (item.dict.name && (!item.dict.url || !item.dict.data)) {
    labelName = 'title'
    valueName = 'key'
  }
  if (allowCoverComponent.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = dicItem[(item.dict.props && item.dict.props.label) || labelName]
      let tmp = dicItem[(item.dict.props && item.dict.props.value) || valueName]
      let disabled = (typeof dicItem['disabled'] == 'undefined') ? false : ( dicItem['disabled'] === true ? true : false )
      let indeterminate = (typeof dicItem['indeterminate'] == 'undefined') ? false : ( dicItem['indeterminate'] === true ? true : false )
      let value
      if (item.dict.name || item.dict.data) value = tmp.toString()
      else if (tmp === 'true') value = true
      else if (tmp === 'false') value = false
      else value = tmp
      tran[value] = label
      colors[value] = item.dict.tagColors && item.dict.tagColors[value] || undefined
      return { label, value, disabled, indeterminate }
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  data.colors = colors
  return data
}

export const loadDict = async (dictList, item) => {
  if (allowUseDictComponent.includes(item.formType) && item.dict) {
    if (item.dict.name) {
      const response = await commonApi.getDict(item.dict.name)
      if (response.data) {
        dictList[item.dataIndex] = handlerDictProps(item, response.data)
      }
    } else if (item.dict.url) {
      const dictData = tool.local.get('dictData')
      if (item.dict.cache && dictData[item.dataIndex]) {
        dictList[item.dataIndex] = dictData[item.dataIndex]
      } else {
        const response = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.body || {})
        if (response.data) {
          dictList[item.dataIndex] = handlerDictProps(item, response.data)
          if (item.dict.cache) {
            dictData[item.dataIndex] = dictList[item.dataIndex]
            tool.local.set('dictData', dictData)
          }
        }
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

const requestCascaderData = async (val, dict, dictList, name) => {
  if (dict && dict.url) {
    let response
    if (dict && dict.url.indexOf('{{key}}') > 0) {
      response = await requestDict(dict.url.replace('{{key}}', val), dict.method || 'GET', dict.params || {}, dict.data || {})
    } else {
      let temp = { key: val }
      const params = Object.assign(dict.params || {}, temp)
      const data   = Object.assign(dict.data || {}, temp)
      response = await requestDict(dict.url, dict.method || 'GET', params || {}, data || {})
    }
    if (response.data && response.code === 200) {
      dictList[name] = response.data.map(dicItem => {
        return {
          'label': dicItem[ (dict.props && dict.props.label) || 'label'  ],
          'value': dicItem[ (dict.props && dict.props.value) || 'value' ],
          'disabled': (typeof dicItem['disabled'] == 'undefined') ? false : ( dicItem['disabled'] === true ? true : false ),
          'indeterminate': (typeof dicItem['indeterminate'] == 'undefined') ? false : ( dicItem['indeterminate'] === true ? true : false )
        } 
      })
    } else {
      console.error(response)
    }
  }
}

export const handlerCascader = async (val, column, columns, dictList, formModel, clearData = true) => {
  if (column.cascaderItem && isArray(column.cascaderItem)) {
    column.cascaderItem.map(async name => {
      const dict = columns.find(col => col.dataIndex === name && col.dict).dict
      clearData && set(formModel, name, undefined)
      requestCascaderData(val, dict, dictList, name)
    })
  }
}