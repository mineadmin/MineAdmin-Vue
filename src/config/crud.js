export default {

  // 每页记录数
  pageSize: 10,

  // 响应返回解析
  parseResponseData: (res) => {

    return res.data.list
    ?
    // 分页响应字段结构定义
    {
      rows: res.data.list,      // 分析行数据字段结构
      total: res.data.total,    // 分析总数字段结构
      message: res.message,      // 分析描述字段结构
      code: res.code            // 分析状态字段结构
    }
    :
    // 无分页响应字段结构定义
    {
      rows: res.data,           // 分析行数据字段结构
      message: res.message,     // 分析描述字段结构
      code: res.code            // 分析状态字段结构
    }

  },

  // 请求字段结构定义
  request: {
    page: 'page',             //规定当前分页字段
    pageSize: 'limit',        //规定一页条数字段
  }

}