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
    url: 'plugin/store/index',
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
 * 本地应用安装状态
 */
export const getLocalAppInstallList = () => {
    return request({
        url: 'plugin/store/getLocalAppInstallList',
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

/**
 * 下载应用
 */
export const download = (data) => {
  return request({
    url: 'plugin/store/download',
    method: 'post',
    timeout: 500000,
    data,
  })
}

/**
 * 安装应用
 */
export const install = (data) => {
    return request({
        url: 'plugin/store/install',
        method: 'post',
        data,
    })
}

/**
 * 安装应用
 */
export const unInstall = (data) => {
  return request({
    url: 'plugin/store/unInstall',
    method: 'post',
    data,
  })
}