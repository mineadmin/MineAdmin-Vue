import { request } from '@/utils/request.js'

/**
 * 数据源管理 API JS
 */

export default {

  /**
   * 获取数据源管理分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'setting/datasource/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加数据源管理
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'setting/datasource/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新数据源管理数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'setting/datasource/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取数据源管理
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'setting/datasource/read',
      method: 'get',
      data
    })
  },

  /**
   * 将数据源管理删除，有软删除则移动到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'setting/datasource/delete',
      method: 'delete',
      data
    })
  },

  /**
    * 数据源管理导入
    * @returns
    */
  importExcel (data = {}) {
    return request({
      url: 'setting/datasource/import',
      method: 'post',
      data
    })
  },

  /**
   * 数据源管理下载模板
   * @returns
   */
  downloadTemplate () {
    return request({
      url: 'setting/datasource/downloadTemplate',
      method: 'post',
      responseType: 'blob'
    })
  },

  /**
   * 数据源管理导出
   * @returns
   */
  exportExcel (params = {}) {
    return request({
      url: 'setting/datasource/export',
      method: 'post',
      responseType: 'blob',
      params
    })
  },

  /**
   * 测试数据库连接
   * @returns
   */
  testLink (data = {}) {
    return request({
      url: 'setting/datasource/testLink',
      method: 'post',
      data
    })
  },

  /**
   * 获取某数据源的表
   * @returns
   */
  getDataSourceTablePageList (params = {}) {
    return request({
      url: 'setting/datasource/getDataSourceTablePageList',
      method: 'get',
      params
    })
  },

}