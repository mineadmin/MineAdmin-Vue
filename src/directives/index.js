import auth from './auth'


export default {
  install (Vue) {
    Vue.directive('auth', auth)
  }
}
