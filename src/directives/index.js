import auth from './auth/index'
import role from './role/index'


export default {
  install (Vue) {
    Vue.directive('auth', auth)
    Vue.directive('role', role)
  }
}
