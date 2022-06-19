import checkAuth from '@/directives/auth/auth'
import checkRole from '@/directives/role/role'

// 检查权限函数
export const auth = name => checkAuth(name)

// 检查角色函数
export const role = name => checkRole(name)

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
