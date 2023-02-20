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
      <template #operationCell="{ record }">
        <a-popconfirm content="确实要将该用户强制退出吗?" position="bottom" @ok="kick(record)">
          <a-link v-auth="['system:onlineUser:kick']"><icon-import /> 强制退出</a-link>
        </a-popconfirm>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import monitor from '@/api/system/monitor'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const kick = async (row) => {
    const response = await monitor.kickUser({ id: row.id })
    response.success && Message.success(response.message)
  }

  const crud = reactive({
    api: monitor.getOnlineUserPageList,
    showIndex: false,
    operationColumn: true,
    operationWidth: 120,
    searchColNumber: 2,
    pageLayout: 'fixed',
  })

  const columns = reactive([
    { title: '用户账户', dataIndex: 'username', search: true, width: 180 },
    { title: '用户昵称', dataIndex: 'nickname', width: 180 },
    { title: '登录IP', dataIndex: 'login_ip', width: 180 },
    { title: '登录时间', dataIndex: 'login_time', width: 180 },
  ])
</script>

<script>
export default { name: 'system:onlineUser' }
</script>

<style scoped>

</style>