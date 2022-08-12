import { request } from '@/utils/request.js'

/**
 * 用户表 API JS
 */

export default {
  /**
   * 获取用户表分页列表
   * @returns
   */
  getList(params = {}) {
    return request({
      url: 'users/list/index',
      method: 'get',
      params,
    })
  },

  /**
   * 添加用户表
   * @returns
   */
  save(data = {}) {
    return request({
      url: 'users/list/save',
      method: 'post',
      data,
    })
  },

  /**
   * 更新用户表数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: 'users/list/update/' + id,
      method: 'put',
      data,
    })
  },

  /**
   * 读取用户表
   * @returns
   */
  read(data = {}) {
    return request({
      url: 'users/list/read',
      method: 'get',
      data,
    })
  },

  /**
   * 将用户表删除，有软删除则移动到回收站
   * @returns
   */
  deletes(data) {
    return request({
      url: 'users/list/delete',
      method: 'delete',
      data,
    })
  },

  /**
   * 从回收站获取用户表数据列表
   * @returns
   */
  getRecycleList(params = {}) {
    return request({
      url: 'users/list/recycle',
      method: 'get',
      params,
    })
  },

  /**
   * 恢复用户表数据
   * @returns
   */
  recoverys(data) {
    return request({
      url: 'users/list/recovery',
      method: 'put',
      data,
    })
  },

  /**
   * 真实删除用户表
   * @returns
   */
  realDeletes(data) {
    return request({
      url: 'users/list/realDelete',
      method: 'delete',
      data,
    })
  },

  /**
   * 更改用户表数据
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'users/list/changeStatus',
      method: 'put',
      data,
    })
  },

  /**
   * 修改用户表数值数据，自增自减
   * @returns
   */
  numberOperation(data = {}) {
    return request({
      url: 'users/list/numberOperation',
      method: 'put',
      data,
    })
  },

  /**
   * 用户表导入
   * @returns
   */
  importExcel(data = {}) {
    return request({
      url: 'users/list/import',
      method: 'post',
      data,
    })
  },

  /**
   * 用户表下载模板
   * @returns
   */
  downloadTemplate() {
    return request({
      url: 'users/list/downloadTemplate',
      method: 'post',
      responseType: 'blob',
    })
  },

  /**
   * 用户表导出
   * @returns
   */
  exportExcel(params = {}) {
    return request({
      url: 'users/list/export',
      method: 'post',
      responseType: 'blob',
      params,
    })
  },
}
