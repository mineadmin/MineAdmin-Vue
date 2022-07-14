import { request } from '@/utils/request.js'

/**
 * 接口分组 API JS
 */

export default {

  /**
   * 获取接口分组分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'system/apiGroup/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取接口分组分页列表，无分页，下拉用
   * @returns
   */
  getSelectList (params = {}) {
    return request({
      url: 'system/apiGroup/list',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取接口分组数据列表
   * @returns
   */
  getRecycleList (params = {}) {
    return request({
      url: 'system/apiGroup/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加接口分组
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'system/apiGroup/save',
      method: 'post',
      data
    })
  },

  /**
   * 读取接口分组
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'system/apiGroup/read',
      method: 'post',
      data
    })
  },

  /**
   * 将接口分组移到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'system/apiGroup/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复接口分组数据
   * @returns
   */
  recoverys (data) {
    return request({
      url: 'system/apiGroup/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除接口分组
   * @returns
   */
  realDeletes (data) {
    return request({
      url: 'system/apiGroup/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新接口分组数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'system/apiGroup/update/' + id,
      method: 'put',
      data
    })
  }
}