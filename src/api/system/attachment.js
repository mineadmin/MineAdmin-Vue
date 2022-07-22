import { request } from '@/utils/request.js'

export default {

  /**
   * 获取文件分页列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: 'system/attachment/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取文件
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: 'system/attachment/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 移到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'system/attachment/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复数据
   * @returns
   */
  recoverys (data) {
    return request({
      url: 'system/attachment/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除
   * @returns
   */
  realDeletes (data) {
    return request({
      url: 'system/attachment/realDelete',
      method: 'delete',
      data
    })
  }
}