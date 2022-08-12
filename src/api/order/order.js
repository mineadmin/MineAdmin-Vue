import { request } from '@/utils/request.js'

/**
 * 订单管理 API JS
 */

export default {
  /**
   * 获取订单管理分页列表
   * @returns
   */
  getList(params = {}) {
    return request({
      url: 'order/list/index',
      method: 'get',
      params,
    })
  },

  /**
   * 添加订单管理
   * @returns
   */
  save(data = {}) {
    return request({
      url: 'order/list/save',
      method: 'post',
      data,
    })
  },

  /**
   * 更新订单管理数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: 'order/list/update/' + id,
      method: 'put',
      data,
    })
  },

  /**
   * 读取订单管理
   * @returns
   */
  read(data = {}) {
    return request({
      url: 'order/list/read',
      method: 'get',
      data,
    })
  },

  /**
   * 将订单管理删除，有软删除则移动到回收站
   * @returns
   */
  deletes(data) {
    return request({
      url: 'order/list/delete',
      method: 'delete',
      data,
    })
  },

  /**
   * 从回收站获取订单管理数据列表
   * @returns
   */
  getRecycleList(params = {}) {
    return request({
      url: 'order/list/recycle',
      method: 'get',
      params,
    })
  },

  /**
   * 恢复订单管理数据
   * @returns
   */
  recoverys(data) {
    return request({
      url: 'order/list/recovery',
      method: 'put',
      data,
    })
  },

  /**
   * 真实删除订单管理
   * @returns
   */
  realDeletes(data) {
    return request({
      url: 'order/list/realDelete',
      method: 'delete',
      data,
    })
  },

  /**
   * 更改订单管理数据
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'order/list/changeStatus',
      method: 'put',
      data,
    })
  },

  /**
   * 修改订单管理数值数据，自增自减
   * @returns
   */
  numberOperation(data = {}) {
    return request({
      url: 'order/list/numberOperation',
      method: 'put',
      data,
    })
  },

  /**
   * 订单管理导出
   * @returns
   */
  exportExcel(params = {}) {
    return request({
      url: 'order/list/export',
      method: 'post',
      responseType: 'blob',
      params,
    })
  },
}
