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
  <a-modal v-model:visible="visible" fullscreen :footer="false">
    <template #title>
      维护 {{ currentRow.name }} 的{{ currentType == 'request' ? '请求参数' : '响应参数' }}
    </template>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-switch :checked-value="1" unchecked-value="2" @change="changeStatus($event, record.id)"
          :default-checked="record.status == 1" />
      </template>
    </ma-crud>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import apiColumn from '@/api/system/apiColumn'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const visible = ref(false)
const currentType = ref('')
const currentRow = ref({ id: undefined, name: undefined })

const changeStatus = async (status, id) => {
  const response = await apiColumn.changeStatus({ id, status })
  if (response.success) {
    Message.success(response.message)
  }
}

const open = (row, type) => {
  currentRow.value = row
  currentType.value = type
  crudRef.value.requestData()
  visible.value = true
}

const crud = reactive({
  autoRequest: false,
  api: apiColumn.getList,
  recycleApi: apiColumn.getRecycleList,
  showIndex: false,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationWidth: 300,
  add: { show: true, api: apiColumn.save, auth: ['system:api:save'] },
  edit: { show: true, api: apiColumn.update, auth: ['system:api:update'] },
  delete: {
    show: true,
    api: apiColumn.deletes, auth: ['system:api:delete'],
    realApi: apiColumn.realDeletes, realAuth: ['system:api:realDeletes']
  },
  import: { show: true, url: 'system/apiColumn/import', templateUrl: 'system/apiColumn/downloadTemplate' },
  export: { show: true, url: 'system/apiColumn/export' },
  recovery: { show: true, api: apiColumn.recoverys, auth: ['system:api:recovery'] },
  formOption: { width: '800px' },
  beforeAdd: (form) => form.api_id = currentRow.value.id,
  beforeRequest: (params) => {
    params.api_id = currentRow.value.id
    params.type = currentType.value == 'request' ? 1 : 2
  },
})

const columns = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
  {
    title: '字段名称', dataIndex: 'name', search: true, commonRules: [{ required: true, message: '字段名称必填' }],
    span: 12, labelWidth: '120px',
  },
  {
    title: '数据类型', dataIndex: 'data_type', formType: 'select', commonRules: [{ required: true, message: '数据类型必选' }],
    dict: { name: 'api_data_type', props: { label: 'title', value: 'key' }, translation: true},
    span: 12, search: true
  },
  {
    title: '字段类型', dataIndex: 'type', disabled: true, formType: 'radio',
    dict: { data: [{ label: '请求', value: 1 }, { label: '响应', value: 2 }], translation: true },
    addDefaultValue: () => currentType.value == 'request' ? 1 : 2, 
    span: 8, labelWidth: '140px',
  },
  {
    title: '状态', dataIndex: 'status', search: true, formType: 'radio',
    dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
    addDefaultValue: '1', span: 8,
  },
  {
    title: '必填', dataIndex: 'is_required', search: true,
    dict: { data: [{ label: '是', value: 2 }, { label: '否', value: 1 }], translation: true },
    addDefaultValue: 2, formType: 'radio', span: 8,
    control: (value) => {
      if ( value == 2) {
        return { 'default_value': { display: false } }
      } else {
        return { 'default_value': { display: true } }
      }
    }
  },
  {
    title: '默认值', dataIndex: 'default_value', span: 24
  },
  {
    title: '字段说明', dataIndex: 'description', formType: 'editor', hide: true,
  },
  {
    title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
  },
  {
    title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
    search: true, formType: 'range', width: 180
  }
])

defineExpose({ open })
</script>

<style scoped>
</style>