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
    <template #title>维护 {{ currentRow.name }} 字典数据</template>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
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
import { dict } from '@/api/system/dict'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const visible = ref(false)
const currentRow = ref({ id: undefined, name: undefined })

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

const open = (row) => {
  currentRow.value = row
  crudRef.value.requestData()
  visible.value = true
}

const crud = reactive({
  autoRequest: false,
  api: dict.getPageList,
  recycleApi: dict.getRecyclePageList,
  showIndex: false,
  pageLayout: 'fixed',
  rowSelection: { showCheckedAll: true },
  operationColumn: true,
  operationColumnWidth: 160,
  beforeAdd: (form) => {
    form.code = currentRow.value?.code
    form.type_id = currentRow.value?.id
    return true
  },
  add: { show: true, api: dict.saveDictData, auth: ['system:dict:save'] },
  edit: { show: true, api: dict.updateDictData, auth: ['system:dict:update'] },
  delete: {
    show: true,
    api: dict.deletesDictData, auth: ['system:dict:delete'],
    realApi: dict.realDeletesDictData, realAuth: ['system:dict:realDeletes']
  },
  recovery: { show: true, api: dict.recoverysDictData, auth: ['system:dict:recovery'] },
  beforeRequest: (params) => params.type_id = currentRow.value.id
})

const columns = reactive([
  { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
  {
    title: '字典标签', dataIndex: 'label', search: true, width: 220,
    commonRules: [{ required: true, message: '字典标签必填' }],
  },
  {
    title: '字典键值', dataIndex: 'value', search: true, width: 220,
    commonRules: [{ required: true, message: '字典键值必填' }],
  },
  {
    title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
    min: 0, max: 1000
  },
  {
    title: '状态', dataIndex: 'status', search: true, formType: 'radio',
    dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
    addDefaultValue: '1', width: 180,
  },
  {
    title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
  },
  {
    title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
    search: true, formType: 'range', width: 180,
  }
])

defineExpose({ open })
</script>

<style scoped>
</style>