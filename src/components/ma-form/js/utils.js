import { isEmpty, isFunction, get } from 'lodash'

export const containerItems = ['tabs', 'table', 'card', 'grid', 'grid-tailwind', 'children-form']
export const inputType      = ['input', 'input-password', 'input-search']
export const pickerType     = ['date', 'month', 'year', 'week', 'quarter', 'range', 'time']

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
  if (pickerType.includes(formType)) {
    return 'MaFormPicker'
  }
  if (inputType.includes(formType)) {
    return 'MaFormInput'
  }
  return (`MaForm${toHump(formType)}`)
}

export const handleFlatteningColumns = (data, columns, isChildrenForm = undefined) => {
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
        // case 'children-form':
        //   item.formList && handleFlatteningColumns(item.formList, columns, item.dataIndex, true)
        //   break
      }
    } else {
      // if (isChildrenForm) {
      //   item['isChildrenForm'] = true
      // }
      columns.push(item)
    }
  }
}