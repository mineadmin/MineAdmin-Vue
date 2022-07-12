import checkAuth from '@/directives/auth/auth'
import checkRole from '@/directives/role/role'
import { Notification } from '@arco-design/web-vue'

export const success = (title, content) => {
  Notification.success({ title, content, closable: true })
}

export const info = (title, content) => {
  Notification.info({ title, content, closable: true })
}

export const error = (title, content) => {
  Notification.error({ title, content, closable: true })
}

// 检查权限函数
export const auth = name => checkAuth(name)

// 检查角色函数
export const role = name => checkRole(name)