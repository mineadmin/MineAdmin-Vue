import { request } from '@/utils/request.js'

/**
 * 应用分组 API JS
 */

export default {

  /**
   * 获取应用分组分页列表
   * @returns
   */
  getList(params = {}) {
    return request({
      url: 'system/appGroup/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取接口分组分页列表，无分页，下拉用
   * @returns
   */
  getSelectList(params = {}) {
    return request({
      url: 'system/appGroup/list',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取应用分组数据列表
   * @returns
   */
  getRecycleList(params = {}) {
    return request({
      url: 'system/appGroup/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加应用分组
   * @returns
   */
  save(data = {}) {
    return request({
      url: 'system/appGroup/save',
      method: 'post',
      data
    })
  },

  /**
   * 读取应用分组
   * @returns
   */
  read(data = {}) {
    return request({
      url: 'system/appGroup/read',
      method: 'post',
      data
    })
  },

  /**
   * 将应用分组移到回收站
   * @returns
   */
  deletes(data) {
    return request({
      url: 'system/appGroup/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复应用分组数据
   * @returns
   */
  recoverys(data) {
    return request({
      url: 'system/appGroup/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除应用分组
   * @returns
   */
  realDeletes(data) {
    return request({
      url: 'system/appGroup/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新应用分组数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: 'system/appGroup/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'system/appGroup/changeStatus',
      method: 'put',
      data
    })
  },

}