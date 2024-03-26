import { isEmpty, isFunction, get, set } from 'lodash'

export const containerItems = ['tabs', 'table', 'card', 'grid', 'grid-tailwind', 'children-form']
export const inputType      = ['input', 'input-password', 'input-search']
export const pickerType     = ['date', 'month', 'year', 'week', 'quarter', 'range', 'time']

export const interactiveControl = (form, columns, maFormObject) => {
  const obj = []
  const names = []
  const keys = Object.keys(form)
  if (keys && keys.length > 0) {
    keys.map(item => {
      if (form[item] && typeof form[item] === 'object') {
        for (let name in form[item]) {
          names.push(`${item}.${name}`)
        }
      }
    })
  }
  for (let name in form) {
    columns.map( item => {
      if ((item.dataIndex === name || names.includes(item.dataIndex)) && item.onControl && isFunction(item.onControl)) {
        obj.push(item.onControl(get(form, item.dataIndex), maFormObject))
      }
    })
  }
  obj.map(changItem => {
    columns.map( (item, idx) => {
      for (let name in changItem) {
        if (name === item.dataIndex) {
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
  if (pickerType.includes(formType)) {
    return 'MaFormPicker'
  }
  if (inputType.includes(formType)) {
    return 'MaFormInput'
  }
  return (`MaForm${toHump(formType)}`)
}

export const handleFlatteningColumns = (data, columns) => {
  for (let key in data) {
    const item = data[key]
    if ( containerItems.includes(item.formType) ) {
      switch ( item.formType ) {
        case 'tabs': 
          if ( item.tabs ) {
            item.tabs.map(tab => {
              tab.formList && handleFlatteningColumns(tab.formList, columns)
            })
          }
          break
        case 'card':
          item.formList && handleFlatteningColumns(item.formList, columns)
          break
        case 'grid-tailwind':
        case 'grid':
          if ( item.cols ) {
            item.cols.map(col => {
              col.formList && handleFlatteningColumns(col.formList, columns)
            })
          }
          break
        case 'table':
          if ( item.rows ) {
            item.rows.map(row => {
              if ( row.cols ) {
                row.cols.map(col => {
                  col.formList && handleFlatteningColumns(col.formList, columns)
                })
              }
            })
          }
          break
        case 'children-form':
          item.formList.map(list => list.parentDataIndex = item.dataIndex)
          item.formList && handleFlatteningColumns(item.formList, columns)
          break
      }
    } else {
      columns.push(item)
    }
  }
}

export const insertGlobalCssToHead = (cssCode) => {
  const head = document.getElementsByTagName('head')[0]
  const oldStyle = document.getElementById('mineadmin-global-css')
  oldStyle && head.removeChild(oldStyle)

  const newStyle = document.createElement('style')
  newStyle.rel = 'stylesheet'
  newStyle.id = 'mineadmin-global-css'
  try {
    newStyle.appendChild(document.createTextNode(cssCode))
  } catch(ex) {
    newStyle.styleSheet.cssText = cssCode
  }

  head.appendChild(newStyle)
}

export const insertGlobalFunctionsToHtml = (functionsCode) => {
  const bodyEle = document.getElementsByTagName('body')[0]
  const oldScriptEle = document.getElementById('mineadmin-global-functions')
  oldScriptEle && bodyEle.removeChild(oldScriptEle)

  const newScriptEle = document.createElement('script')
  newScriptEle.id = 'mineadmin-global-functions'
  newScriptEle.type = 'text/javascript'
  newScriptEle.innerHTML = functionsCode
  bodyEle.appendChild(newScriptEle)
}