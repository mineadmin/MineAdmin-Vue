import { VNodeChild } from "vue";

/**
 * 表单组件类型
 */
import { FieldRule } from "@arco-design/web-vue";

export type FormDateType =
  | "radio"
  | "checkbox"
  | "select"
  | "transfer"
  | "tree-select"
  | "cascader"
  | "date"
  | "month"
  | "year"
  | "week"
  | "quarter"
  | "range"
  | "time"
  | "input"
  | "password"
  | "textarea"
  | "upload"
  | "select-user"
  | "editor"
  | "code-editor"
  | "icon"
  | "user-info"
  | "city-linkage"
  | "form-group"
  | "select-resource";
/**
 * 列字典
 */
export interface ColumnDict {
  // 字典名称,快捷查询字典接口查询
  name?: string;
  // 自定义url查询
  url?: string;
  // url查询方法,填写url之后生效
  method?: "GET" | "POST" | "PUT" | "DELETE";
  // url查询params数据,填写url之后生效
  params?: object;
  // url查询body数据,填写url之后生效
  body?: object;
  // 直接设置字典值
  data?: object | Function;
  // 表格列的值是否翻译为字典对应标签
  translation?: boolean;
  // 表格key 和 value的props设置
  props?: {
    label?: string;
    value?: string;
  };
}

export interface BasicColumn {
  // 标题
  title: string;
  // 字段名称
  dataIndex: string;
  // 组件类型
  formType?: FormDateType;
  // 表格列对齐方式
  align?: "center" | "right" | "left";
  // 字段是否加入搜索
  search?: boolean;
  // 列宽
  width?: number | "auto";
  // 表格列是否隐藏
  hide?: boolean;
  // 编辑|创建 通用是否显示字段
  display?: boolean;
  // 添加弹窗是否显示字段
  addDisplay?: boolean;
  // 编辑弹窗是否显示字段
  editDisplay?: boolean;
  // 编辑|创建 通用是否禁用字段
  disabled?: boolean;
  // 添加弹窗是否禁用字段
  addDisabled?: boolean;
  // 编辑弹窗是否禁用字段
  editDisabled?: boolean;
  // 编辑|创建 通用是否只读字段
  readonly?: boolean;
  // 添加弹窗是否只读字段
  addReadonly?: boolean;
  // 编辑弹窗是否只读字段
  editReadonly?: boolean;
  // 自定义渲染
  customRender?:
    | (({ record, column, rowIndex }) => VNodeChild | JSX.Element)
    | VNodeChild
    | JSX.Element;
  // 字段新增时默认值
  addDefaultValue?:
    | number
    | string
    | boolean
    | undefined
    | ((record) => number | string | boolean | undefined);
  // 字段编辑时默认值
  editDefaultValue?:
    | number
    | string
    | boolean
    | undefined
    | ((record) => number | string | boolean | undefined);
  // select,radio,treeSelect,下拉字典配置
  dict?: ColumnDict;
  // 继承公用配置
  common?: boolean;
  // select 和 tree-select 组件是否开启虚拟列表
  virtualList?: boolean;
  // 搜索默认值
  searchDefaultValue?: number | string | undefined;
  // 搜索描述
  searchPlaceholder?: string;
  //编辑|创建 通用规则
  commonRules?: FieldRule | FieldRule[];
  // 创建时规则
  addRules?: FieldRule | FieldRule[];
  // 编辑时规则
  editRules?: FieldRule | FieldRule[];
  // 子表单数据
  children?: BasicColumn[];
}
