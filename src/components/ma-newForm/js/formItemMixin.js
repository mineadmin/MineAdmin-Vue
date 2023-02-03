import { isString, isFunction } from 'lodash'
export const maEvent = {
  handleInputEvent: (component, value) => {
    if (component.onInput) {
      if ( isString(component.onInput) ) {
        let customFn = new Function('value', component.onInput)
        customFn.call(component, value)
      }
      if ( isFunction(component.onInput) ) {
        component.onInput(value)
      }
    }
  },

  handleChangeEvent: (component, value) => {
    if (component.onChange) {
      if ( isString(component.onChange) ) {
        let customFn = new Function('value', component.onChange)
        customFn.call(component, value)
      }
      if ( isFunction(component.onChange) ) {
        component.onChange(value)
      }
    }
  },

  handleInputSearchEvent: (component, value) => {
    if (component.onInputSearch) {
      if ( isString(component.onInputSearch) ) {
        let customFn = new Function('value', component.onInputSearch)
        customFn.call(component, value)
      }
      if ( isFunction(component.onInputSearch) ) {
        component.onInputSearch(value)
      }
    }
  },

  handleCommonEvent: (component, evName) => {
    if (component[evName]) {
      if ( isString(component[evName]) ) {
        let customFn = new Function('value', component[evName])
        customFn.call(component)
      }
      if ( isFunction(component[evName]) ) {
        component[evName]()
      }
    }
  }
}