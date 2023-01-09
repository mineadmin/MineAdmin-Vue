import { get } from 'lodash'
export const handlerProps = (allowType, item, tmpArr) => {
  let data = []
  let tran = {}
  let colors = {}
  if (allowType.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = get(dicItem, (item.dict.props && item.dict.props.label) || 'label')
      let tmp = get(dicItem, (item.dict.props && item.dict.props.value) || 'value' )
      const value = typeof tmp == 'boolean' ? tmp + '' : tmp
      colors[value] = item.dict.tagColors && item.dict.tagColors[value] || undefined
      tran[value] = label
      return { label, value } 
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  data.colors = colors
  return data
}

