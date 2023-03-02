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
  <a-drawer :footer="false" v-model:visible="visible" width="800px">
    <template #title>执行日志</template>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <template #status="{ record }">
        <a-tag :color="`${record.status == 1 ? 'green' : 'red'}`">
          {{ record.status == 1 ? '成功' : '失败' }}
        </a-tag>
      </template>

      <template #exception_info="{ record }">
        <a-link @click="lookException(record)"><icon-eye /> 查看</a-link>
      </template>
    </ma-crud>
  </a-drawer>
</template>

<script setup>
  import { ref, reactive, h } from 'vue'
  import crontab from '@/api/setting/crontab'
  import { Modal } from '@arco-design/web-vue'

  const crudRef = ref()
  const crontabId = ref()
  const visible = ref(false)

  const open = (id) => {
    crontabId.value = id
    crudRef.value.requestData()
    visible.value = true
  }

  const lookException = (row) => {
    const info = row.exception_info
    Modal.info({
      simple: false,
      title: '异常信息',
      content: info == '' ? '无异常信息' : info,
    })
  }

  const crud = reactive({
    autoRequest: false,
    api: crontab.getLogPageList,
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 100,
    delete: {
      show: true,
      api: crontab.deleteLog, auth: ['setting:crontab:deleteCrontabLog'],
    },
    beforeRequest: (params) => {
      params.orderBy = 'created_at'
      params.orderType = 'desc'
      params.crontab_id = crontabId.value
    }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: '执行时间', dataIndex: 'created_at', width: 180 },
    { title: '执行目标', dataIndex: 'target', width: 240 },
    { title: '执行结果', dataIndex: 'status', width: 100 },
    { title: '异常信息', dataIndex: 'exception_info', width: 100 },
  ])

  defineExpose({ open })
</script>