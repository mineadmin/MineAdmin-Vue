export default {
  // 是否自动初始化表单并加载字典及联动远程数据
  init: true,
  // 表单加载数据中提示文案
  loadingText: '加载中...',
  // 表单样式class
  customClass: [],
  // 表单控件尺寸（全局） 'mini' | 'small' | 'medium' | 'large' 
  size: 'medium',
  // 标签的对齐方向
  labelAlign: 'right',
  // horizontal 水平排列 vertical 垂直排列 inline 行内排列
  layout: 'horizontal',
  // 表单是否禁用
  disabled: false,
  // 表单项验证规则整体配置，例子：{ title: [{ required: true, message: '请输入标题'}] }
  rules: [],
  // 是否显示按钮
  showButtons: true,

  // 提交按钮图标
  submitIcon: 'icon-send',
  // 提交按钮类型
  submitType: 'primary',
  // 提交按钮状态
  submitStatus: 'normal',
  // 提交按钮文案
  submitText: '提交',
  // 是否显示提交按钮
  submitShowBtn: true,

  // 重置按钮图标
  resetIcon: 'icon-refresh',
  // 重置按钮类型
  resetType: 'secondary',
  // 重置按钮状态
  resetStatus: 'normal',
  // 重置按钮文案
  resetText: '重置',
  // 是否显示重置按钮
  resetShowBtn: true,

  // 表单标题文案
  formTitle: '未命名表单',
  // 是否显示表单标题
  showFormTitle: false,
  // 自定义标题样式css
  formTitleStyle: '',
  // 自定义标题样式class
  formTitleClass: [],
}