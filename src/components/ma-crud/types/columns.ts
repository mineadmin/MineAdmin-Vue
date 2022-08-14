/**
 * 表单组件类型
 */
import { FieldRule } from '@arco-design/web-vue'

export type FormDateType =
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'transfer'
  | 'treeSelect'
  | 'tree-select'
  | 'cascader'
  | 'date'
  | 'month'
  | 'year'
  | 'week'
  | 'quarter'
  | 'range'
  | 'time'
  | 'input'
  | 'password'
  | 'textarea'
/**
 * 列字典
 */
export interface ColumnDict {
  // 字典名称,快捷查询字典接口查询
  name?: string
  // 自定义url查询
  url?: string
  // url查询方法,填写url之后生效
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // url查询params,填写url之后生效
  params?: object
  // 直接设置字典值
  data?: object
}

export interface BasicColumn {
  // 标题
  title: string
  // 字段名称
  dataIndex: string
  // 组件类型
  formType?: FormDateType
  // 表格列对齐方式
  align?: 'center' | 'right' | 'left'
  // 字段是否加入搜索
  search?: boolean
  // 列宽
  width?: number | 'auto'
  // 表格列是否隐藏
  hide?: boolean
  // 添加弹窗是否显示字段
  addDisplay?: boolean
  // 编辑弹窗是否显示字段
  editDisplay?: boolean
  // 字段编辑时默认值
  editDefaultValue?: number | string | boolean | undefined | ((record) => number | string | boolean | undefined)
  // select,radio,treeSelect,下拉字典配置
  dict?: ColumnDict
  // 搜索默认值
  searchDefaultValue?: number | string | undefined
  // 搜索描述
  searchPlaceholder?: string
  //编辑|创建 通用规则
  rules?: FieldRule | FieldRule[]
  // 创建时规则
  addRules?: FieldRule | FieldRule[]
  // 编辑时规则
  editRules?: FieldRule | FieldRule[]
}
