export default {
  // 主键名称
  pk: 'id',
  // 请求api方法
  api: () => {},
  // 请求前置处理
  beforeRequest: () => {},
  // 请求后置处理
  afterRequest: () => {},
  // 是否自动请求
  autoRequest: true,
  // 请求参数
  requestParams: {},
  // 设置分页组件每页记录数
  pageSizeOption: [],
  // 是否开启表格分页
  tablePagination: false,
  // 设置选择列
  rowSelection: undefined,
  // 是否显示边框
  bordered: { wrapper: true, cell: false },
  // 是否开启拖拽排序
  dragSort: false,
  // 每页记录数
  pageSize: 10,
  // 子节点为空隐藏节点按钮
  hideExpandButtonOnEmpty: true,
  // 默认展开所有行
  expandAllRows: false,
  // 默认展开搜索
  expandSearch: true,
  // 斑马线
  stripe: true,
  // 新增、编辑、删除完成后是否刷新表格
  dataCompleteRefresh: true,
  // 表格大小
  size: 'large',
  // 是否开启双击编辑数据
  isDbClickEdit: true,
  // 是否显示展开/折叠按钮
  isExpand: false,
  // 是否显示自定义
  showExpandRow: false,
  // 是否显示总结行
  showSummary: false,
  // 自定义总结行，要传入函数
  customerSummary: false,
  // 是否显示工具栏
  showTools: true,
  // 表头是否吸顶
  stickyHeader: true,
  // 开启新增编辑组件显示顺序自定义
  openViewOrdered: false,
  // 页面布局方式，支持 normal（标准）和 fixed（固定）两种
  pageLayout: 'normal',
  // 默认统一设置列宽度
  columnWidth: 100,
  // 搜索每行列数
  searchColNumber: 4,
  // 新增和编辑显示设置
  viewLayoutSetting: {
    // 布局方式, 支持 auto（自动） 和 customer（自定义）两种
    layout: 'auto',
    // 显示方式支持模态框和抽屉: modal drawer
    viewType: 'modal',
    // 显示宽度
    width: 600,
    // 是否全屏，只有modal有效
    isFull: false,
    // 表单设置一行多少列，会自适应，在布局为 auto 下生效
    cols: 1,
    // 标签对齐方式
    labelAlign: 'right'
  },
  // 搜索栏是否自定义布局
  searchCustomerLayout: false,
  add: {
    // 新增api
    api: undefined,
    // 显示新增按钮的权限
    auth: [],
    // 显示新增按钮的角色
    role: [],
    // 按钮文案
    text: '新增',
    // 是否显示
    show: false,
  },
  edit: {
    // 编辑api
    api: undefined,
    // 显示编辑按钮的权限
    auth: [],
    // 显示编辑按钮的角色
    role: [],
    // 按钮文案
    text: '编辑',
    // 是否显示
    show: false,
  },
  delete: {

    // 删除api
    api: undefined,
    // 显示删除按钮的权限
    auth: [],
    // 显示删除按钮的角色
    role: [],
    // 按钮文案
    text: '删除',

    // 真实删除api
    realApi: undefined,
    // 显示真实删除按钮的权限
    realAuth: [],
    // 显示真实删除按钮的角色
    realRole: [],
    // 真实按钮文案
    realText: '删除',

    // 是否显示
    show: false,
  },
  recovery: {
    // 恢复api
    api: undefined,
    // 显示恢复按钮的权限
    auth: [],
    // 显示恢复按钮的角色
    role: [],
    // 按钮文案
    text: '恢复',
    // 是否显示
    show: false,
  },
  // see: {
  //   // 显示查看按钮的权限
  //   auth: [],
  //   // 显示查看按钮的角色
  //   role: [],
  //   // 按钮文案
  //   text: '查看',
  //   // 是否显示
  //   show: false,
  // },
  import: {
    // 导入url
    url: undefined,
    // 下载模板地址
    templateUrl: undefined,
    // 显示导入按钮的权限
    auth: [],
    // 显示导入按钮的角色
    role: [],
    // 按钮文案
    text: '导入',
    // 是否显示
    show: false,
  },
  export: {
    // 导出url
    url: undefined,
    // 显示导出按钮的权限
    auth: [],
    // 显示导出按钮的角色
    role: [],
    // 按钮文案
    text: '导出',
    // 是否显示
    show: false,
  },
  // 是否显示索引列
  showIndex: false,
  // 索引列名称
  indexLabel: '序号',
  // 设置请求数据label
  requestParamsLabel: undefined,
  // 表格滚动默认宽高
  scroll: { x: '100%', y: '100%' },
  // 调整列宽
  resizable: true,
  // 是否显示操作列
  operationColumn: false,
  // 操作列宽度
  operationWidth: 160,
  // 操作列名称
  operationColumnText: '操作',
}