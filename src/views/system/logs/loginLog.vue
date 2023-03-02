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
    <ma-crud :options="crud" :columns="columns" ref="crudRef">

    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import loginLog from '@/api/system/loginLog'

  const crudRef = ref()

  const crud = reactive({
    api: loginLog.getPageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    requestParams: { orderBy: 'login_time', orderType: 'desc' },
    delete: { show: true, api: loginLog.deletes, auth: ['system:loginLog:delete'] },
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: '登录用户', dataIndex: 'username', search: true, width: 150 }, 
    { 
      title: '登录状态', dataIndex: 'status', search: true, width: 120, formType: 'select',
      dict: { data: [ { label: '成功', value: 1 }, { label: '失败', value: 2 } ], translation: true }
    },
    { title: '登录IP', dataIndex: 'ip', width: 150, search: true },
    { title: '登录地点', dataIndex: 'ip_location', width: 150 },
    { title: '操作系统', dataIndex: 'os', width: 150},
    { title: '浏览器', dataIndex: 'browser', width: 150},
    { title: '登录信息', dataIndex: 'message', width: 180},
    { title: '登录时间', dataIndex: 'login_time', width: 180, search: true, formType: 'range' },
  ])
</script>

<script>
export default { name: 'system:loginLog' }
</script>

<style scoped>

</style>