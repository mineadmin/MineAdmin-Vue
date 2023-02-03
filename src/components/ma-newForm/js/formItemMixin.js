import { isString, isFunction } from 'lodash'
export const maEvent = {
  handleInputEvent: (component,value) => {
    if (component.onInput) {
      if ( isString(component.onInput) ) {
        let customFn = new Function('value', component.onInput)
        customFn.call(component, value)
      }
      if ( isFunction(component.onInput) ) {
        component.onInput(value)
      }
    }
  }
}