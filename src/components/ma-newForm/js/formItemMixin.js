import { isString, isFunction } from 'lodash'
export const maEvent = {
  customeEvent: (component, value, evName) => {
    if (component[evName]) {
      if ( isString(component[evName]) ) {
        let customFn = new Function('value', component[evName])
        customFn.call(component, value)
      }
      if ( isFunction(component[evName]) ) {
        component[evName](value)
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
  },

  handleInputEvent: (component, value) => {
    maEvent.customeEvent(component, value, 'onInput')
  },

  handleChangeEvent: (component, value) => {
    maEvent.customeEvent(component, value, 'onChange')
  },

  handleInputSearchEvent: (component, value) => {
    maEvent.customeEvent(component, value, 'onInputSearch')
  },

  handleTabClickEvent: (component, value) => {
    maEvent.customeEvent(component, value, 'onTabClick')
  },

  handleTabAddEvent: (component) => {
    maEvent.customeEvent(component, component?.options?.tabs, 'onTabAdd')
  },

  handleTabDeleteEvent: (component, value) => {
    maEvent.customeEvent(component, { tabs: component?.options?.tabs, value }, 'onTabDelete')
  },
}