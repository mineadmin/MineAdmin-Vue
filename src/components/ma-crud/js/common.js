export const handlerProps = (allowType, item, tmpArr) => {
  let data = []
  if (allowType.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      return {
        'label': dicItem[ (item.dict.props && item.dict.props.label) || 'code'  ],
        'value': dicItem[ (item.dict.props && item.dict.props.value) || 'value' ]
      } 
    })
  } else {
    data = tmpArr
  }

  return data
}