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
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-switch
          :checked-value="1" 
          unchecked-value="2"
          @change="changeStatus($event, record.id)"
          :default-checked="record.status == 1"
        />
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import appGroup from '@/api/system/appGroup'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const changeStatus = async (status, id) => {
    const response = await appGroup.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: appGroup.getList,
    recycleApi: appGroup.getRecycleList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 160,
    add: { show: true, api: appGroup.save, auth: ['system:appGroup:save'] },
    edit: { show: true, api: appGroup.update, auth: ['system:appGroup:update'] },
    delete: {
      show: true,
      api: appGroup.deletes, auth: ['system:appGroup:delete'],
      realApi: appGroup.realDeletes, realAuth: ['system:appGroup:realDeletes']
    },
    recovery: { show: true, api: appGroup.recoverys, auth: ['system:appGroup:recovery']},
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { 
      title: '组名称', dataIndex: 'name', search: true, width: 220,
      commonRules: [{ required: true, message: '组名称必填' }],
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 160,
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false, width: 180,
    },
    {
      title: '更新时间', dataIndex: 'updated_at', addDisplay: false, editDisplay: false, width: 180,
    },
  ])
</script>

<script>
export default { name: 'system:appGroup' }
</script>

<style scoped>

</style>