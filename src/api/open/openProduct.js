import { request } from '@/utils/request.js'

/**
 * 商品 API JS
 */

export default {

  /**
   * 获取商品分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'open/product/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加商品
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'open/product/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新商品数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'open/product/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取商品
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'open/product/read',
      method: 'get',
      data
    })
  },

  /**
   * 将商品删除，有软删除则移动到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'open/product/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 从回收站获取商品数据列表
   * @returns
   */
  getRecycleList (params = {}) {
    return request({
      url: 'open/product/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 恢复商品数据
   * @returns
   */
  recoverys (data) {
    return request({
      url: 'open/product/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除商品
   * @returns
   */
  realDeletes (data) {
    return request({
      url: 'open/product/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更改商品数据
   * @returns
   */
  changeStatus (data = {}) {
    return request({
      url: 'open/product/changeStatus',
      method: 'put',
      data
    })
  },

  /**
   * 修改商品数值数据，自增自减
   * @returns
   */
  numberOperation (data = {}) {
    return request({
      url: 'open/product/numberOperation',
      method: 'put',
      data
    })
  },

  /**
    * 商品导入
    * @returns
    */
  importExcel (data = {}) {
    return request({
      url: 'open/product/import',
      method: 'post',
      data
    })
  },

  /**
   * 商品下载模板
   * @returns
   */
  downloadTemplate () {
    return request({
      url: 'open/product/downloadTemplate',
      method: 'post',
      responseType: 'blob'
    })
  },

  /**
   * 商品导出
   * @returns
   */
  exportExcel (params = {}) {
    return request({
      url: 'open/product/export',
      method: 'post',
      responseType: 'blob',
      params
    })
  },


}