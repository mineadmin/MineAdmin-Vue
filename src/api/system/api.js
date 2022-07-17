import { request } from '@/utils/request.js'

/**
 * 接口管理 API JS
 */

export default {

  /**
   * 获取接口管理分页列表
   * @returns
   */
  getList(params = {}) {
    return request({
      url: 'system/api/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取模块列表
   * @returns
   */
  getModuleList() {
    return request({
      url: 'system/api/getModuleList',
      method: 'get'
    })
  },

  /**
   * 从回收站获取接口管理数据列表
   * @returns
   */
  getRecycleList(params = {}) {
    return request({
      url: 'system/api/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加接口管理
   * @returns
   */
  save(data = {}) {
    return request({
      url: 'system/api/save',
      method: 'post',
      data
    })
  },

  /**
   * 读取接口管理
   * @returns
   */
  read(data = {}) {
    return request({
      url: 'system/api/read',
      method: 'post',
      data
    })
  },

  /**
   * 将接口管理移到回收站
   * @returns
   */
  deletes(data) {
    return request({
      url: 'system/api/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复接口管理数据
   * @returns
   */
  recoverys(data) {
    return request({
      url: 'system/api/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除接口管理
   * @returns
   */
  realDeletes(data) {
    return request({
      url: 'system/api/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新接口管理数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: 'system/api/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改部门状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'system/api/changeStatus',
      method: 'put',
      data
    })
  },

}