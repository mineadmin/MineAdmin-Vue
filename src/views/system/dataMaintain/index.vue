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
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="selectChange">
      <!-- 表格操作按钮扩展 -->
      <template #tableButtons>
        <a-button @click="operate('optimize')" type="primary" status="success" v-auth="['system:dataMaintain:optimize']">
          <template #icon><icon-tool /></template>优化表
        </a-button>

        <a-button @click="operate('clear')" type="primary" status="success" v-auth="['system:dataMaintain:fragment']">
          <template #icon><icon-experiment /></template>清理碎片
        </a-button>
      </template>
      <!-- 操作 -->
      <template #operationCell="{ record }">
        <a-link @click="tableStruct(record.name)">
          <icon-eye /> 查看
        </a-link>
      </template>
    </ma-crud>

    <a-modal v-model:visible="visible" width="900px" :footer="false">
      <template #title>表结构数据</template>
      <ma-crud ref="tableRef" :options="tableCrud" :columns="[
        { title: '字段名称', dataIndex: 'column_name' },
        { title: '字段类型', dataIndex: 'column_type' },
        { title: '字段注释', dataIndex: 'column_comment' },
      ]" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import dataMaintain from '@/api/system/dataMaintain'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()
const tableRef = ref()
const selecteds = ref([])
const currentTable = ref('')
const visible = ref(false)

const selectChange = (val) => selecteds.value = val

const operate = async (op) => {
  if (selecteds.value.length === 0) {
    Message.error('至少要选择一条数据')
    return
  }
  let response
  if (op === 'optimize') {
    response = await dataMaintain.optimize(selecteds.value)
  }

  if (op === 'clear') {
    response = await dataMaintain.fragment(selecteds.value)
  }

  response.success && Message.success(response.message)
}

const tableStruct = (name) => {
  tableCrud.requestParams.table = name
  visible.value = true
  tableRef.value.requestData()
}

const crud = reactive({
  api: dataMaintain.getPageList,
  searchColNumber: 2,
  pageLayout: 'fixed',
  showIndex: false,
  rowSelection: { showCheckedAll: true, key: 'name' },
  operationColumn: true,
  operationWidth: 100,
})

const columns = reactive([
  { title: '表名称', dataIndex: 'name', search: true, width: 200 },
  { title: '表引擎', dataIndex: 'engine', width: 150 },
  { title: '总行数', dataIndex: 'rows', width: 150 },
  { title: '碎片大小', dataIndex: 'data_free', width: 150 },
  { title: '数据大小', dataIndex: 'data_length', width: 150 },
  { title: '索引大小', dataIndex: 'index_length', width: 150 },
  { title: '字符集', dataIndex: 'collation', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '表注释', dataIndex: 'comment', width: 180 },
])

const tableCrud = reactive(
  {
    api: dataMaintain.getDetailed,
    requestParams: {},
    autoRequest: false,
    showTools: false,
  }
)
</script>

<script>
export default { name: 'system:dataMaintain' }
</script>

<style scoped>
</style>