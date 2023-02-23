<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <a-modal fullscreen v-model:visible="visible" :footer="false">
    <template #title>管理配置</template>
    <div class="h-full">
      <ma-crud ref="crudRef" :options="crud" :columns="columns" />
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import config from '@/api/setting/config'

const visible = ref(false)
const groupId = ref()
const crudRef = ref()
const inputComponent = [
  { label: '文本框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉选择框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '开关', value: 'switch' },
  { label: '图片上传', value: 'upload' },
  { label: '富文本编辑器', value: 'editor' },
]

const open = (id) => {
  groupId.value = id
  visible.value = true
  crudRef.value.requestData()
}
const crud = reactive({
  pk: 'key',
  autoRequest: false,
  api: config.getConfigList,
  rowSelection: { showCheckedAll: true, key: 'key' },
  showIndex: false,
  operationColumn: true,
  operationWidth: 160,
  edit: { show: true, api: config.update, auth: ['setting:config:update'] },
  delete: { show: true, api: config.delete, auth: ['setting:config:delete'] },
  beforeRequest: (params) => params.group_id = groupId.value,
  beforeEdit: (record) => {
    if (record.config_select_data) {
      record.config_select_data = record.config_select_data.replace(/\r|\n|\s/g, '')
      record.config_select_data = record.config_select_data.replace(',]', ']')
    }
  },
  formOption: { width: '700px' }
})

const columns = reactive([
  {
    title: '所属组',
    dataIndex: 'group_id',
    formType: 'select',
    hide: true,
    dict: { url: 'setting/configGroup/index', props: { label: 'name', value: 'id' } },
    commonRules: [{ required: true, message: '所属组必选' }],
    width: 180,
  },
  {
    title: '配置标题',
    dataIndex: 'name',
    search: true,
    commonRules: [{ required: true, message: '配置标题必填' }],
    width: 220,
  },
  {
    title: '配置标识',
    dataIndex: 'key',
    search: true,
    commonRules: [{ required: true, message: '配置标识必填' }],
    disabled: true,
    width: 180,
  },
  {
    title: '配置值',
    dataIndex: 'value',
    width: 200,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    formType: 'input-number',
    width: 200,
    min: 0,
    max: 999,
  },
  {
    title: '输入组件',
    dataIndex: 'input_type',
    formType: 'select',
    commonRules: [{ required: true, message: '输入组件必选' }],
    dict: { data: inputComponent },
    control: (val) => {
      const temp = ['select', 'radio', 'checkbox']
      return { config_select_data: { display: temp.includes(val) } }
    },
    width: 180,
  },
  {
    title: '配置选择数据',
    dataIndex: 'config_select_data',
    formType: 'code-editor',
    height: 200,
    hide: true,
    formExtra: '用于配置下拉、单选、复选的数据，格式例子：[{"label":"数据一", "code":"shuju1"},...]',
  }
])

defineExpose({ open })
</script>