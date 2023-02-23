export interface BasicCrud {
  // 表格接口
  api?: undefined | any;
  // 主键名称
  pk?: string;
  // 设置选择列
  rowSelection?:
    | undefined
    | {
        // 选择值的标识，默认id
        key?: string;
        // 选择列是否显示全选
        showCheckedAll?: boolean;
        // 行选择器类型
        type?: 'checkbox' | 'radio';
        // 选择器列标题
        title?: string | '#';
        // 列宽度
        width?: number | 60;
        // 是否固定
        fixed?: boolean | false;
        // 是否仅展示当前页的keys
        onlyCurrent?: boolean | true;
      };
  // 搜索label宽度
  searchLabelWidth?: string | "auto";
  // 搜索label对齐方式
  searchLabelAlign?: "center" | "right" | "left";
  // 一行多少列
  searchLabelCols?: number;
  // 是否显示边框
  bordered?: { wrapper?: boolean; cell?: boolean };
  // 是否开启拖拽排序
  dragSort?: boolean;
  // 子节点为空隐藏节点按钮
  hideExpandButtonOnEmpty?: boolean;
  // 默认展开所有行
  expandAllRows?: boolean;
  // 斑马线
  stripe?: boolean;
  // 新增、编辑、删除完成后是否刷新表格
  dataCompleteRefresh?: boolean;
  // 表格大小
  size?: "mini" | "small" | "medium" | "large";
  // 是否开启双击编辑数据
  isDbClickEdit?: boolean;
  // 是否显示展开/折叠按钮
  isExpand?: boolean;
  // 是否显示自定义
  showExpandRow?: boolean;
  // 是否显示总结行
  showSummary?: boolean;
  // 自定义总结行，要传入函数
  customerSummary?: boolean;
  // 是否显示工具栏
  showTools?: boolean;
  // 新增和编辑显示设置
  formOption?: {
    // 显示方式支持模态框和抽屉?: modal drawer
    viewType?: "modal" | "drawer";
    // 显示宽度
    width?: number;
    // 是否全屏，只有modal有效
    isFull?: boolean;
  };
  //新增确定之前修改form值
  beforeAdd?: (form) => void;
  //新增确定之后调用,返回接口response和form值
  afterAdd?: (response, form) => void;
  //编辑确定之前修改form值
  beforeEdit?: (form) => void;
  //编辑确定之后调用,返回接口response和form值
  afterEdit?: (response, form) => void;
  add?: {
    // 新增api
    api?: undefined | any;
    // 显示新增按钮的权限
    auth?: string[];
    // 显示新增按钮的角色
    role?: string[];
    // 按钮文案
    text?: string;
    // 是否显示
    show?: boolean;
  };
  edit?: {
    // 编辑api
    api?: undefined | any;
    // 显示编辑按钮的权限
    auth?: string[];
    // 显示编辑按钮的角色
    role?: string[];
    // 按钮文案
    text?: string;
    // 是否显示
    show?: boolean;
  };
  delete?: {
    // 删除api
    api?: undefined | any;
    // 显示删除按钮的权限
    auth?: string[];
    // 显示删除按钮的角色
    role?: string[];
    // 按钮文案
    text?: string;

    // 真实删除api
    realApi?: undefined | any;
    // 显示真实删除按钮的权限
    realAuth?: string[];
    // 显示真实删除按钮的角色
    realRole?: string[];
    // 真实按钮文案
    realText?: string;
    
    // 是否显示
    show?: boolean;
  };
  // Todo
  recycleApi?: any;
  recovery?: {
    // 显示恢复按钮的权限
    auth?: string[];
    // 显示恢复按钮的角色
    role?: string[];
    // 按钮文案
    text?: string;
    // 是否显示
    show?: boolean;
    // 恢复列表查询api
    api?: undefined | any;
  };
  // see?: {
  //   // 显示查看按钮的权限
  //   auth?: string[]
  //   // 显示查看按钮的角色
  //   role?: string[]
  //   // 按钮文案
  //   text?: string
  //   // 是否显示
  //   show?: boolean
  // }
  import?: {
    // 导入url
    url?: undefined | any;
    // 下载模板地址
    templateUrl?: undefined | any;
    // 显示导入按钮的权限
    auth?: string[];
    // 显示导入按钮的角色
    role?: string[];
    // 按钮文案
    text?: string;
    // 是否显示
    show?: boolean;
  };
  export?: {
    // 导出url
    url?: undefined | any;
    // 显示导出按钮的权限
    auth?: string[];
    // 显示导出按钮的角色
    role?: string[];
    // 按钮文案
    text?: string;
    // 是否显示
    show?: boolean;
  };
  // 是否显示索引列
  showIndex?: boolean;
  // 索引列名称
  indexLabel?: string;
  // 设置请求数据label
  requestParamsLabel?: undefined;
  // 表格滚动默认宽高
  scroll?: {
    x?: string;
    y?: string;
  };
  // 调整列宽
  resizable?: boolean;
  // 是否显示操作列
  operationColumn?: boolean;
  // 操作列宽度
  operationWidth?: number;
  // 操作列名称
  operationColumnText?: string;
}
