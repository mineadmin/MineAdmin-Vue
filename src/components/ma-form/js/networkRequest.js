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
    } else if (item.dict.remote) {
      let requestData = {
        openPage: item.dict?.openPage ?? false,
        remoteOption: item.dict.remoteOption ?? {}
      }
      requestData = Object.assign(requestData, item.dict.pageOption)

      if (requestData.openPage) {
        const { data } = await requestDict(item.dict.remote, 'POST', {}, requestData)
        dictList[item.dataIndex] = handlerDictProps(item, data.items)
        dictList[item.dataIndex].pageInfo = data.pageInfo
      } else {
        const dictData = tool.local.get('dictData')
        if (item.dict.cache && dictData[item.dataIndex]) {
          dictList[item.dataIndex] = dictData[item.dataIndex]
        } else {
          const { data } = await requestDict(item.dict.remote, 'POST', {}, requestData)
          dictList[item.dataIndex] = handlerDictProps(item, data)
          if (item.dict.cache) {
            dictData[item.dataIndex] = dictList[item.dataIndex]
            tool.local.set('dictData', dictData)
          }
        }
      }
    } else if (item.dict.url) {
      let requestData = {
        openPage: item.dict?.openPage ?? false,
        remoteOption: item.dict.remoteOption ?? {}
      }
      requestData = Object.assign(requestData, item.dict.pageOption)

      if (requestData.openPage) {
        if (item.dict?.method === 'GET' || item.dict?.method === 'get') {
          item.dict.params = Object.assign(item.dict.params ?? {}, requestData)
        } else {
          item.dict.body = Object.assign(item.dict.body ?? {}, requestData)
        }
        const { data } = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.body || {})
        dictList[item.dataIndex] = handlerDictProps(item, data.items)
        dictList[item.dataIndex].pageInfo = data.pageInfo
      } else {
        const dictData = tool.local.get('dictData')
        if (item.dict.cache && dictData[item.dataIndex]) {
          dictList[item.dataIndex] = dictData[item.dataIndex]
        } else {
          const { data } = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.body || {})
          dictList[item.dataIndex] = handlerDictProps(item, data)
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
  if (dict && (dict.remote || dict.url)) {
    let requestData = { openPage: dict?.openPage ?? false, remoteOption: dict.remoteOption ?? {} }
    let response
    const pageOption = Object.assign(requestData, dict.pageOption)
    const url = dict.remote ?? dict.url
    if (dict && url.indexOf('{{key}}') > 0) {
      response = await requestDict(
        url.replace('{{key}}', val), dict.method ?? 'GET',
        Object.assign(dict.params || {}, requestData.openPage ? pageOption : {}),
        Object.assign(dict.data || {}, requestData.openPage ? pageOption : {})
      )
    } else {
      let temp = Object.assign({ key: val }, requestData.openPage ? pageOption : {})
      const params = Object.assign(dict.params || {}, temp)
      const data   = Object.assign(dict.data || {}, temp)
      response = await requestDict(url, dict.method ?? 'GET', params || {}, data || {})
    }
    if (response.data && response.code === 200) {
      let dataIems = requestData.openPage ? response.data.items : response.data
      dictList[name] = dataIems.map(dicItem => {
        return {
          'label': dicItem[ (dict.props && dict.props.label) || 'label'  ],
          'value': dicItem[ (dict.props && dict.props.value) || 'value' ],
          'disabled': (typeof dicItem['disabled'] == 'undefined') ? false : ( dicItem['disabled'] === true ? true : false ),
          'indeterminate': (typeof dicItem['indeterminate'] == 'undefined') ? false : ( dicItem['indeterminate'] === true ? true : false )
        } 
      })
      dictList[name].pageInfo = response.data.pageInfo ?? undefined
      
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