import { request } from '@/utils/request.js'

/**
 * 代码生成示例 API JS
 */

export default {

  /**
   * 获取代码生成示例分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'demo/example1/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加代码生成示例
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'demo/example1/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新代码生成示例数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'demo/example1/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取代码生成示例
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'demo/example1/read',
      method: 'get',
      data
    })
  },

  /**
   * 将代码生成示例删除，有软删除则移动到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'demo/example1/delete',
      method: 'delete',
      data
    })
  },

  /**
    * 代码生成示例导入
    * @returns
    */
  importExcel (data = {}) {
    return request({
      url: 'demo/example1/import',
      method: 'post',
      data
    })
  },

  /**
   * 代码生成示例下载模板
   * @returns
   */
  downloadTemplate () {
    return request({
      url: 'demo/example1/downloadTemplate',
      method: 'post',
      responseType: 'blob'
    })
  },

  /**
   * 代码生成示例导出
   * @returns
   */
  exportExcel (params = {}) {
    return request({
      url: 'demo/example1/export',
      method: 'post',
      responseType: 'blob',
      params
    })
  },


}