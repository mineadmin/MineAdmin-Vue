import { request } from '@/utils/request.js'

export const dictType = {

  /**
   * 获取字典类型，无分页
   * @returns
   */
  getTypeList(params = {}) {
    return request({
      url: 'system/dictType/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取字典，无分页
   * @returns
   */
  getList(params = {}) {
    return request({
      url: 'system/dictType/list',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取字典类型
   * @returns
   */
  getRecycleTypeList(params = {}) {
    return request({
      url: 'system/dictType/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加字典类型
   * @returns
   */
  save(params = {}) {
    return request({
      url: 'system/dictType/save',
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
      url: 'system/dictType/delete',
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
      url: 'system/dictType/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除
   * @returns
   */
  realDelete(data) {
    return request({
      url: 'system/dictType/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, params = {}) {
    return request({
      url: 'system/dictType/update/' + id,
      method: 'put',
      data: params
    })
  },

  /**
   * 更改字典类型状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'system/dictType/changeStatus',
      method: 'put',
      data
    })
  },
}

export const dict = {
  /**
   * 快捷查询字典
   * @param {*} params
   * @returns
   */
  getDict(code) {
    return request({
      url: 'system/dataDict/list?code=' + code,
      method: 'get'
    })
  },

  /**
   * 快捷查询多个字典
   * @param {*} params
   * @returns
   */
  getDicts(codes) {
    return request({
      url: 'system/dataDict/lists?codes=' + codes.join(','),
      method: 'get'
    })
  },

  /**
   * 获取字典数据分页列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: 'system/dataDict/index',
      method: 'get',
      params
    })
  },

  /**
   * 从回收站获取字典数据
   * @returns
   */
  getRecyclePageList(params = {}) {
    return request({
      url: 'system/dataDict/recycle',
      method: 'get',
      params
    })
  },

  /**
   * 添加字典数据
   * @returns
   */
  saveDictData(data = {}) {
    return request({
      url: 'system/dataDict/save',
      method: 'post',
      data
    })
  },

  /**
   * 移到回收站
   * @returns
   */
  deletesDictData(data) {
    return request({
      url: 'system/dataDict/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复数据
   * @returns
   */
  recoverysDictData(data) {
    return request({
      url: 'system/dataDict/recovery',
      method: 'put',
      data
    })
  },

  /**
   * 真实删除
   * @returns
   */
  realDeletesDictData(data) {
    return request({
      url: 'system/dataDict/realDelete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  updateDictData(id, data = {}) {
    return request({
      url: 'system/dataDict/update/' + id,
      method: 'put',
      data
    })
  },

  /**
   * 清空缓存
   * @returns
   */
  clearCache() {
    return request({
      url: 'system/dataDict/clearCache',
      method: 'post'
    })
  },

  /**
   * 数字运算操作
   * @returns
   */
  numberOperation(data = {}) {
    return request({
      url: 'system/dataDict/numberOperation',
      method: 'put',
      data
    })
  },

  /**
   * 更改字典状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'system/dataDict/changeStatus',
      method: 'put',
      data
    })
  },
}