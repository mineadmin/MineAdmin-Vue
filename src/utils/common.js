import auth from '@/directives/auth/auth'
import role from '@/directives/role/role'

// 检查权限函数
export const checkAuth = name => auth(name)

// 检查角色函数
export const checkRole = name => role(name)

// 防抖
export const debouce = function (callback, delay) {
  let timer = null
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => callback.apply(this, [arguments]), delay)
  }
}

// 节流
export const throttle = function (callback, wait) {
  let run = true
  return () => {
    if (! run) return
    run = false
    setTimeout(() => {
      callback.apply(this, [arguments])
      run = true
    }, wait)
  }
}
