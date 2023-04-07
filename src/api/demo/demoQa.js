import { request } from '@/utils/request.js'

/**
 * 问答示例 API JS
 */

export default {

  /**
   * 获取问答示例分页列表
   * @returns
   */
  getList (params = {}) {
    return request({
      url: 'demo/qa/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加问答示例
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'demo/qa/save',
      method: 'post',
      data
    })
  },

  /**
   * 更新问答示例数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: 'demo/qa/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取问答示例
   * @returns
   */
  read (data = {}) {
    return request({
      url: 'demo/qa/read',
      method: 'get',
      data
    })
  },

  /**
   * 将问答示例删除，有软删除则移动到回收站
   * @returns
   */
  deletes (data) {
    return request({
      url: 'demo/qa/delete',
      method: 'delete',
      data
    })
  },

  /**
    * 问答示例导入
    * @returns
    */
  importExcel (data = {}) {
    return request({
      url: 'demo/qa/import',
      method: 'post',
      data
    })
  },

  /**
   * 问答示例下载模板
   * @returns
   */
  downloadTemplate () {
    return request({
      url: 'demo/qa/downloadTemplate',
      method: 'post',
      responseType: 'blob'
    })
  },

  /**
   * 问答示例导出
   * @returns
   */
  exportExcel (params = {}) {
    return request({
      url: 'demo/qa/export',
      method: 'post',
      responseType: 'blob',
      params
    })
  },


}