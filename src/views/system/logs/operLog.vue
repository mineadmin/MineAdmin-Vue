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
      <template #title>操作日志详细信息</template>
      <div class="arco-descriptions arco-descriptions-layout-horizontal arco-descriptions-size-medium arco-descriptions-border">
        <div class="arco-descriptions-body">
          <table class="arco-descriptions-table">
            <tbody>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">请求路由</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.router }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">操作用户</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.username }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">请求方法</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.method }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">响应代码</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.response_code }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">业务名称</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.service_name }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">操作时间</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.created_at }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">用户IP</td>
                <td class="arco-descriptions-item-value arco-descriptions-item-value-block" colspan="1">{{ currentRow?.ip }}</td>
              </tr>
              <tr class="arco-descriptions-row">
                <td class="arco-descriptions-item-label arco-descriptions-item-label-block">用户地点</td>
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
  import operLog from '@/api/system/operLog'
  import { formatJson } from '@/utils/common'

  const crudRef = ref()
  const visible = ref(false)
  const currentRow = ref({ request_data: undefined, response_data: undefined })

  const openDetails = (record) => {
    currentRow.value = record
    if (record.request_data.length > 0) {
      currentRow.value.request_data = 
        ! /\\\\/g.test(record.request_data)
        ? formatJson(currentRow.value.request_data)
        : currentRow.value.request_data.replace(/,/g, ",\n")
    }
    if (record.response_data.length > 0) {
      currentRow.value.response_data =
        ! /\\\\/g.test(record.response_data)
        ? formatJson(currentRow.value.response_data)
        : currentRow.value.response_data.replace(/,/g, "\n")
    }
    visible.value = true
  }

  const crud = reactive({
    api: operLog.getPageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    requestParams: { orderBy: 'created_at', orderType: 'desc' },
    delete: { show: true, api: operLog.deletes, auth: ['system:operLog:delete'] },
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: '登录用户', dataIndex: 'username', search: true, width: 150 }, 
    { title: '业务名称', dataIndex: 'service_name', search: true, width: 150 }, 
    { title: '路由', dataIndex: 'router', width: 240 }, 
    { title: '登录IP', dataIndex: 'ip', width: 150, search: true },
    { title: '登录地点', dataIndex: 'ip_location', width: 150 },
    { title: '状态码', dataIndex: 'response_code', width: 120},
    { title: '操作时间', dataIndex: 'created_at', width: 180, search: true, formType: 'range' },
  ])
</script>

<script>
export default { name: 'system:operLog' }
</script>

<style scoped>
:deep(.arco-collapse-item-content) {
  padding-left: 10px;
  padding-right: 10px;
}
</style>