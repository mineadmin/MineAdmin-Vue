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
export const getAppList = (params) => {
  return request({
    url: 'plugin/store/getMyApp',
    method: 'get',
    params
  })
}

/**
 * 已购买应用
 */
export const getPayApp = () => {
  return request({
    url: 'plugin/store/getPayApp',
    method: 'get'
  })
}

/**
 * 详情
 */
export const getDetail = (params) => {
    return request({
        url: 'plugin/store/detail',
        method: 'get',
        params
    })
}