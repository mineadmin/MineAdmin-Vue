export const handlerProps = (allowType, item, tmpArr) => {
  let data = []
  let tran = {}
  if (allowType.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = dicItem[ (item.dict.props && item.dict.props.label) || 'code'  ]
      const value = dicItem[ (item.dict.props && item.dict.props.value) || 'value' ]
      tran[value] = label
      return { 'label': label, 'value': value } 
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  return data
}