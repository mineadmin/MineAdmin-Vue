import { request } from '@/utils/request.js'

export default {
  /**
   * 获取用户
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: 'system/user/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取用户
   * @returns
   */
  getRecyclePageList(params = {}) {
    return request({
      url: 'system/user/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 读取一个用户
   * @returns
   */
  read(id) {
    return request({
      url: 'system/user/read/' + id,
      method: 'get'
    })
  },

  /**
   * 添加用户
   * @returns
   */
  save(params = {}) {
    return request({
      url: 'system/user/save',
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
      url: 'system/user/delete',
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
      url: 'system/user/recovery',
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
      url: 'system/user/realDelete',
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
      url: 'system/user/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改用户状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'system/user/changeStatus',
      method: 'put',
      data
    })
  },

  /**
   * 清除用户缓存
   * @returns
   */
  clearCache(params = {}) {
    return request({
      url: 'system/user/clearCache',
      method: 'post',
      data: params
    })
  },

  /**
   * 设置用户首页
   * @returns
   */
  setHomePage(data = {}) {
    return request({
      url: 'system/user/setHomePage',
      method: 'post',
      data
    })
  },

  /**
   * 初始化用户密码
   * @returns
   */
  initUserPassword(data) {
    return request({
      url: 'system/user/initUserPassword',
      method: 'put',
      data
    })
  },

  /**
   * 用户更新个人资料
   * @returns
   */
  updateInfo(data = {}) {
    return request({
      url: 'system/user/updateInfo',
      method: 'post',
      data
    })
  },

  /**
   * 用户修改密码
   * @returns
   */
  modifyPassword(data = {}) {
    return request({
      url: 'system/user/modifyPassword',
      method: 'post',
      data
    })
  },
}
