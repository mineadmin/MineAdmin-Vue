export const menuList = [
  { name: '新增', value: 'save', comment: '勾选生成新增数据按钮菜单及接口' },
  { name: '更新', value: 'update', comment: '勾选生成更新数据按钮菜单及接口' },
  { name: '读取', value: 'read', comment: '勾选生成读取数据按钮菜单及接口' },
  { name: '删除', value: 'delete', comment: '勾选生成真实删除按钮菜单及接口' },
  { name: '回收站列表', value: 'recycle', comment: '勾选生成移到回收站列表、真实删除、恢复菜单及接口，确定该表有deleted_at字段，且模型引入了软删除。' },
  { name: '修改状态', value: 'changeStatus', comment: '勾选生成修改状态按钮菜单及接口，该接口用于单个字段状态修改' },
  { name: '自增自减', value: 'numberOperation', comment: '勾选生成数据自增自减按钮菜单及接口，该接口用于单个字段增减操作' },
  { name: '导入', value: 'import', comment: '勾选生成导入按钮菜单、接口和DTO文件' },
  { name: '导出', value: 'export', comment: '勾选生成导出按钮菜单、接口和DTO文件' },
]

export const realtionsType = [
  { name: '一对一', value: 'hasOne' },
  { name: '一对多', value: 'hasMany' },
  { name: '一对多（反向)', value: 'belongsTo' },
  { name: '多对多', value: 'belongsToMany' },
]

export const columns = [
  { title: '排序', dataIndex: 'sort', slotName: 'sort', width: 100, },
  { title: '字段名称', dataIndex: 'column_name', slotName: 'columnName', width: 150, tooltip: true },
  { title: '字段描述', dataIndex: 'column_comment', slotName: 'columnComment', width: 180 },
  { title: '物理类型', dataIndex: 'column_type', slotName: 'columnType', width: 120, },
  { title: '必填', dataIndex: 'is_required', slotName: 'isRequired', width: 80, },
  { title: '插入', dataIndex: 'is_insert', slotName: 'isInsert', width: 80, },
  { title: '编辑', dataIndex: 'is_edit', slotName: 'isEdit', width: 80, },
  { title: '列表', dataIndex: 'is_list', slotName: 'isList', width: 80, },
  { title: '查询', dataIndex: 'is_query', slotName: 'isQuery', width: 80, },
  { title: '排序', dataIndex: 'is_sort', slotName: 'isSort', width: 80, },
  { title: '查询方式', dataIndex: 'query_type', slotName: 'queryType', width: 180, },
  { title: '页面控件', dataIndex: 'view_type', slotName: 'viewType', width: 240, },
  { title: '数据字典', dataIndex: 'dict_type', slotName: 'dictType', width: 180, },
  { title: '允许角色', dataIndex: 'allow_roles', slotName: 'allowRoles', width: 200, },
]

export const queryType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'neq' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: 'LIKE', value: 'like' },
  { label: 'BETWEEN', value: 'between' },
]

// 页面控件
export const viewComponent = [
  { label: '输入框', value: 'text' },
  { label: '密码框', value: 'password' },
  { label: '文本域', value: 'textarea' },
  { label: '数字输入框', value: 'inputNumber' },
  { label: '标签输入框', value: 'inputTag' },
  { label: '提及', value: 'mention' },
  { label: '开关', value: 'switch' },
  { label: '滑块', value: 'slider' },
  { label: '下拉框', value: 'select' },
  { label: '树形下拉框', value: 'treeSelect' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期选择器', value: 'date' },
  { label: '时间选择器', value: 'time' },
  { label: '评分器', value: 'rate' },
  { label: '级联选择器', value: 'cascader' },
  { label: '数据穿梭框', value: 'transfer' },
  { label: '用户选择器', value: 'selectUser' },
  { label: '用户信息', value: 'userInfo' },
  { label: '省市区联动', value: 'cityLinkage' },
  { label: '子表单', value: 'formGroup' },
  { label: '上传组件', value: 'upload' },
  { label: '资源选择器', value: 'selectResource' },
  { label: '富文本控件', value: 'editor' },
  { label: '代码编辑器', value: 'codeEditor' },
]