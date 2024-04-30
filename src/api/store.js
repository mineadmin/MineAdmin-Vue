import { request } from '@/utils/request.js'

/**
 * 检查是.env 是否设置了 access_token
 */
export const hasAccessToken = () => {
  return request({
    url: 'plugin/store/hasAccessToken',
    method: 'get',
  })
}

/**
 * 请求应用列表
 */
 export const getAppList = () => {
  return request({
    url: 'plugin/store/index',
    method: 'get',
  })
}