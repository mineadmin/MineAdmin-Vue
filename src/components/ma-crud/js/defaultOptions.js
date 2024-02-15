export default {
  // 当前crud组件的 id，全局唯一，不指定则随机生成一个
  id: undefined,
  // 主键名称
  pk: 'id',
  // 表单是否排除PK
  formExcludePk: true,
  // 请求api方法
  api: () => {},
  // 请求回收站api方法
  recycleApi: () => {},
  // 是否自动请求
  autoRequest: true,
  // 请求参数
  requestParams: {},
  // 设置分页组件每页记录数
  pageSizeOption: [10, 20, 30, 50, 100],
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
  customerSummary: undefined,
  // 是否显示工具栏
  showTools: true,
  // 表头是否吸顶
  stickyHeader: true,
  // 页面布局方式，支持 normal（标准）和 fixed（固定）两种
  pageLayout: 'normal',
  // 默认统一设置列宽度
  columnWidth: 100,
  // 搜索标签对齐方式
  searchLabelAlign: 'right',
  // 全局搜索标签宽度
  searchLabelWidth: '85px',
  // 搜索每行列数
  searchColNumber: 4,
  // 搜索提交按钮文案
  searchSubmitButtonText: '搜索',
  // 搜索重置按钮文案
  searchResetButtonText: '重置',
  // 搜索栏加载提示文案
  searchLoadingText: '加载数据中...',

  // 搜索提交前置方法
  beforeSearch: (requestParams) => {},
  // 搜索提交后置方法
  afterSearch: (requestParams) => {},

  // 重置搜索钩子
  resetSearch:(searchData) => {},


  // 请求前置处理
  beforeRequest: (requestParams) => {},
  // 请求后置处理
  afterRequest: (tableData) => {},
  // 新增打开前方法
  beforeOpenAdd: () => {},
  // 新增提交前方法
  beforeAdd: (formData) => {},
  // 新增提交后方法
  afterAdd: (response, formData) => {},
  // 编辑打开前方法
  beforeOpenEdit: (record) => {},
  // 编辑提交前方法
  beforeEdit: (formData) => {},
  // 编辑提交后方法
  afterEdit: (response, formData) => {},
  // 删除前方法
  beforeDelete: (ids) => {},
  // 删除后方法
  afterDelete: (response) => {},

  // 组件初始化事件
  onInit: () => {},

  // 列表 选项卡 参数配置项
  tabs: {
    // 选项卡类型，参考 arco 官方 tabs 的api
    type: 'line',
    // 选项卡触发方式： click | hover
    trigger: 'click',
    // 指定一个字段作为选项卡，该字段的 search 必须为 true， 并且使用了字典
    dataIndex: undefined,
    // 自定义选项卡项 [{ label: 'tab 1', value: 1, disabled: false }]，也可函数返回一个数组
    data: undefined,
    // 默认选中的 tab
    defaultKey: undefined,
    // 切换选项卡时，请求后台数据的参数名
    searchKey: undefined,
    // 选项卡切换事件
    onChange: (value) => {},
    // 选项卡单击事件
    onClick: (value) => {},
  },
  
  // 表单配置项
  formOption: {
    // 显示方式支持模态框和抽屉: modal drawer tag
    viewType: 'modal',
    // 只有 viewType 为 tag 时生效，此值在所有 MaCrud 内唯一
    tagId: '',
    // 只有 viewType 为 tag 时生效，tag标题名称
    tagName: '',
    // tag页设置标签标题的字段名称
    titleDataIndex: undefined,
    // 显示宽度
    width: 600,
    // 是否全屏，只有modal有效
    isFull: false,
    // 表单布局
    layout: []
  },
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
    // 数据来源：table(表格行数据) | api(通过接口获取数据)
    dataSource: 'table',
    // 数据源API接口 
    dataSourceApi: undefined,
    // 是否禁用，仅表格行内按钮有效
    disabled: false,
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
    // 是否禁用，仅表格行内按钮有效
    disabled: false,

    // 真实删除api
    realApi: undefined,
    // 显示真实删除按钮的权限
    realAuth: [],
    // 显示真实删除按钮的角色
    realRole: [],
    // 真实按钮文案
    realText: '删除',
    // 真实删除是否禁用，仅表格行内按钮有效
    realDisabled: false,

    // 是否显示
    show: false,
    // 是否显示批量处理按钮
    batch: true,
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
    // 是否显示批量处理按钮
    batch: true,
  },
  see: {
    // 显示查看按钮的权限
    auth: [],
    // 显示查看按钮的角色
    role: [],
    // 按钮文案
    text: '查看',
    // 是否显示
    show: false,
    // 数据来源：table(表格行数据) | api(通过接口获取数据)
    dataSource: 'table',
    // 数据源API接口 
    dataSourceApi: undefined,
    // 是否禁用，仅表格行内按钮有效
    disabled: false,
  },
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
  // 行自定义 class 名称
  rowCustomClass: (record, rowIndex) => [],
  // 是否显示索引列
  showIndex: false,
  // 索引列名称
  indexLabel: '序号',
  // 索引列宽度
  indexColumnWidth: 70,
  // 索引列固定方向，false 为不固定
  indexColumnFixed: 'left',
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
  // 操作列宽度 (新api)
  operationColumnWidth: 160,
  // 操作列名称
  operationColumnText: '操作',
  // 操作列文字对齐方式
  operationColumnAlign: 'right',
  // 操作列固定方向，false 为不固定
  operationColumnFixed: 'right',

  // 右键菜单配置
  contextMenu: {
    // 是否开启右键菜单
    enabled: true,
    // 右键菜单配置
    items: [
      { operation: 'print' },
      { operation: 'refresh' },
      { operation: 'divider' },
      { operation: 'add' },
      { operation: 'edit' },
      { operation: 'delete' }
    ]
  }
}