import { request } from '@/utils/request.js'

/**
 * 接口文档
 */
export const hasAccessToken = () => {
  return request({
    url: 'plugin/store/hasAccessToken',
    method: 'get',
  })
}