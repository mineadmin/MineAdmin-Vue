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
      <template #title>接口日志详细信息</template>
      <div class="arco-descriptions arco-descriptions-layout-horizontal arco-descriptions-size-medium arco-descriptions-border">
        <div class="arco-descriptions-body">
          <table class="arco-descriptions-table">
            <tbody>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">接口名称</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.api_name }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">请求接口</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.access_name }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">状态代码</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.response_code }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">请求时间</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.access_time }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">访问IP</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.ip }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">访问地点</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.ip_location }}</td>
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
        <a-collapse-item header="请求数据" key="request">
          <ma-code-editor v-model="currentRow.request_data" is-bind :height="150" readonly />
        </a-collapse-item>
        <a-collapse-item header="响应数据" key="response">
          <ma-code-editor v-model="currentRow.response_data" is-bind :height="150" readonly />
        </a-collapse-item>
      </a-collapse>
    </a-drawer>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import maCodeEditor from '@cps/ma-codeEditor/index.vue'
  import apiLog from '@/api/system/apiLog'
  import { formatJson } from '@/utils/common'

  const crudRef = ref()
  const visible = ref(false)
  const currentRow = ref({ request_data: undefined, response_data: undefined })

  const openDetails = (record) => {
    currentRow.value = record
    currentRow.value.request_data = formatJson(record.request_data)
    currentRow.value.response_data = formatJson(record.response_data)
    visible.value = true
  }

  const crud = reactive({
    api: apiLog.getPageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    requestParams: { orderBy: 'access_time', orderType: 'desc' },
    delete: { show: true, api: apiLog.deletes, auth: ['system:apiLog:delete'] },
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: '接口名称', dataIndex: 'api_name', search: true, width: 180 }, 
    { title: '接口地址', dataIndex: 'access_name', search: true, width: 180 }, 
    { title: '访问IP', dataIndex: 'ip', width: 150, search: true },
    { title: '访问地点', dataIndex: 'ip_location', width: 150 },
    { title: '状态码', dataIndex: 'response_code', width: 120},
    { title: '访问时间', dataIndex: 'access_time', width: 180, search: true, formType: 'range' },
  ])
</script>

<script>
export default { name: 'system:apiLog' }
</script>

<style scoped>
:deep(.arco-collapse-item-content) {
  padding-left: 10px;
  padding-right: 10px;
}
</style>