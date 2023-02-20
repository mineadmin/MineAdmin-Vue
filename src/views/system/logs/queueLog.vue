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
    <ma-crud :options="crud" :columns="columns" @row-click="openDetails" ref="crudRef"></ma-crud>

    <!-- 抽屉 -->
    <a-drawer v-model:visible="visible" width="600px" :footer="false">
      <template #title>队列日志详细信息</template>
      <div class="arco-descriptions arco-descriptions-layout-horizontal arco-descriptions-size-medium arco-descriptions-border">
        <div class="arco-descriptions-body">
          <table class="arco-descriptions-table">
            <tbody>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">交换机名称</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.exchange_name }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">路由名称</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.routing_key_name }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">队列名称</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.queue_name }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">延迟时间（秒）</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.delay_time }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">创建时间</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.created_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <a-collapse
        :default-active-key="['request', 'response']"
        expand-icon-position="right"
        class="mt-3"
      >
        <a-collapse-item header="队列数据" key="request">
          <ma-code-editor v-model="currentRow.queue_content" is-bind :height="150" readonly />
        </a-collapse-item>
        <a-collapse-item header="队列日志" key="response">
          <pre>{{ currentRow.log_content == null ? "无日志数据" : currentRow.log_content }}</pre>
        </a-collapse-item>
      </a-collapse>
    </a-drawer>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import maCodeEditor from '@cps/ma-codeEditor/index.vue'
  import queueLog from '@/api/system/queueLog'
  import { formatJson } from '@/utils/common'

  const crudRef = ref()
  const visible = ref(false)
  const currentRow = ref({ request_data: undefined, response_data: undefined })

  const openDetails = (record) => {
    currentRow.value = record
    if (record.queue_content.length > 0) {
      currentRow.value.queue_content = 
        ! /\\\\/g.test(record.queue_content)
        ? formatJson(currentRow.value.queue_content)
        : currentRow.value.queue_content.replace(/,/g, ",\n")
    }
    visible.value = true
  }

  const crud = reactive({
    api: queueLog.getPageList,
    showIndex: false,
    searchLabelWidth: '100px',
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    requestParams: { orderBy: 'created_at', orderType: 'desc' },
    delete: { show: true, api: queueLog.deletes, auth: ['system:queueLog:delete'] },
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: '交换机名称', dataIndex: 'exchange_name', search: true, width: 150 }, 
    { title: '路由名称', dataIndex: 'routing_key_name', search: true, width: 150 }, 
    { title: '队列名称', dataIndex: 'queue_name', width: 150 }, 
    {
      title: '生产状态', dataIndex: 'produce_status', width: 150, search: true, formType: 'select',
      dict: { name: 'queue_produce_status', props: { label: 'title', value: 'key'}, translation: true },
    },
    {
      title: '消费状态', dataIndex: 'consume_status', width: 150, search: true, formType: 'select',
      dict: { name: 'queue_consume_status', props: { label: 'title', value: 'key'}, translation: true },
    },
    { title: '延迟时间（秒）', dataIndex: 'delay_time', width: 150 },
  ])
</script>

<script>
export default { name: 'system:queueLog' }
</script>

<style scoped>
:deep(.arco-collapse-item-content) {
  padding-left: 10px;
  padding-right: 10px;
}
pre {
  font-size: 12px;
  color: #ccc;
  padding: 20px;
  background: #333;
  font-family: consolas;
  line-height: 1.5;
  overflow: auto;
  border-radius: 4px;
}
</style>