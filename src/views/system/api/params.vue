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
    <template #title>维护 {{ currentRow.name }} 的{{ currentType == 'request' ? '请求参数' : '响应参数'}}</template>
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
      <!-- 排序列 -->
      <template #sort="{ record }">
        <a-input-number
          :default-value="record.sort"
          mode="button"
          @change="changeSort($event, record.id)"
          :min="0"
          :max="1000"
        />
      </template>
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
const currentRow = ref({ id: undefined, name: undefined })
const currentType = ref()

const changeStatus = async (status, id) => {
  const response = await dict.changeStatus({ id, status })
  if (response.success) {
    Message.success(response.message)
  }
}

const changeSort = async (value, id) => {
  const response = await dict.numberOperation({ id, numberName: 'sort', numberValue: value })
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
  searchLabelWidth: '75px',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationWidth: 300,
  add: { show: true, api: dict.saveDictData, auth: ['system:apiColumn:add'] },
  edit: { show: true, api: apiColumn.updateDictData, auth: ['system:apiColumn:edit'] },
  delete: {
    show: true,
    api: apiColumn.deletesDictData, auth: ['system:apiColumn:delete'],
    realApi: apiColumn.realDeletesDictData, realAuth: ['system:apiColumn:realDeletes']
  },
  recovery: { show: true, api: apiColumn.recoverysDictData, auth: ['system:apiColumn:recovery'] },
  beforeRequest: (params) => {
    params.api_id = currentRow.value.id
    params.type = currentType.value == 'request' ? 1 : 2
  }
})

const columns = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
  {
    title: '字典标签', dataIndex: 'label', search: true, rules: [{ required: true, message: '字典标签必填' }],
  },
  {
    title: '字典键值', dataIndex: 'value', search: true, rules: [{ required: true, message: '字典键值必填' }],
  },
  {
    title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
    min: 0, max: 1000
  },
  {
    title: '状态', dataIndex: 'status', search: true, formType: 'radio',
    dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
    addDefaultValue: '1',
  },
  {
    title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
  },
  {
    title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
    search: true, formType: 'range'
  }
])

defineExpose({ open })
</script>