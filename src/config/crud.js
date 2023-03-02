export default {
  
  // 响应返回解析
  parseResponseData: (res) => {

    return res?.data?.items
    ?
    // 分页响应字段结构定义
    {
      rows: res?.data?.items ?? [],      // 分析行数据字段结构
      pageInfo: res?.data?.pageInfo,    // 分析总数字段结构
      message: res?.message,      // 分析描述字段结构
      code: res?.code            // 分析状态字段结构
    }
    :
    // 无分页响应字段结构定义
    {
      rows: res?.data ?? [],           // 分析行数据字段结构
      message: res?.message,     // 分析描述字段结构
      code: res?.code            // 分析状态字段结构
    }

  },

  // 请求字段结构定义
  request: {
    page: 'page',             //规定当前分页字段
    pageSize: 'pageSize',        //规定一页条数字段
  }

}