import { request } from '@/utils/request.js'

export default {
  /**
   * 获取分页列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: 'setting/crontab/index',
      method: 'get',
      params
    })
  },

  /**
   * 获取任务日志列表
   * @returns
   */
  getLogPageList (params = {}) {
    return request({
      url: 'setting/crontab/logPageList',
      method: 'get',
      params
    })
  },
  
  /**
   * 删除定时任务日志
   * @returns
   */
  deleteLog (data) {
    return request({
      url: 'setting/crontab/deleteCrontabLog',
      method: 'delete',
      data
    })
  },

  /**
   * 立刻执行一次定时任务
   * @returns
   */
  run (data = {}) {
    return request({
      url: 'setting/crontab/run',
      method: 'post',
      data
    })
  },

  /**
   * 添加
   * @returns
   */
  save (data = {}) {
    return request({
      url: 'setting/crontab/save',
      method: 'post',
      data
    })
  },

  /**
   * 删除
   * @returns
   */
  deletes (data) {
    return request({
      url: 'setting/crontab/delete',
      method: 'delete',
      data
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update (id, params = {}) {
    return request({
      url: 'setting/crontab/update/' + id,
      method: 'put',
      data: params
    })
  },

  /**
   * 更改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: 'setting/crontab/changeStatus',
      method: 'put',
      data
    })
  },

}