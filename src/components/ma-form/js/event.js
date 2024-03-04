import { isString, isFunction } from 'lodash'

export const haveArgsEvent = async (component, value, evName, maformObj) => {
  if (component[evName]) {
    if ( isFunction(component[evName]) ) {
      return await component[evName](value, maformObj)
    }
    if ( isString(component[evName]) ) {
      const customFn = new Function('value', 'maFormObject', component[evName])
      return await customFn.call(component, value, maformObj)
    }
  }
}

export const notHaveArgsEvent = async (component, evName, maformObj) => {
  if (component[evName]) {
    if ( isFunction(component[evName]) ) {
      return await component[evName](maformObj)
    }
    if ( isString(component[evName]) ) {
      const customFn = new Function('maFormObject', component[evName])
      return await customFn.call(component[evName], maformObj)
    }
  }
}

export const tabAddEvent = (component, maformObj) => {
  haveArgsEvent(component, component?.tabs, 'onTabAdd', maformObj)
}

export const tabDeleteEvent = (component, value, maformObj) => {
  haveArgsEvent(component, { tabs: component?.tabs, value }, 'onTabDelete', maformObj)
}

export const runEvent = async (component, evName, maformObj, value = undefined) => {
  return value
  ? await haveArgsEvent(component, value, evName, maformObj)
  : await notHaveArgsEvent(component, evName, maformObj)
}
