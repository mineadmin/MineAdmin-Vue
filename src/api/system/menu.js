import { request } from '@/utils/request.js'

export default {
  /**
   * 获取菜单树
   * @returns
   */
  getList(params = {}) {
    return request({
      url: 'system/menu/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取菜单树
   * @returns
   */
  getRecycleList(params = {}) {
    return request({
      url: 'system/menu/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 获取菜单选择树
   * @returns
   */
  tree(params = {}) {
    return request({
      url: 'system/menu/tree',
      method: 'get',
      params
    })
  },

  /**
   * 添加菜单
   * @returns
   */
  save(params = {}) {
    return request({
      url: 'system/menu/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 移到回收站
   * @returns
   */
  deletes(data) {
    return request({
      url: 'system/menu/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复数据
   * @returns
   */
  recoverys(data) {
    return request({
      url: 'system/menu/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除
   * @returns
   */
  realDeletes(data) {
    return request({
      url: 'system/menu/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: 'system/menu/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 数字运算操作
   * @returns
   */
  numberOperation(data = {}) {
    return request({
      url: 'system/menu/numberOperation',
      method: 'put',
      data
    })
  },

  /**
   * 更改菜单状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'system/menu/changeStatus',
      method: 'put',
      data
    })
  },
}
