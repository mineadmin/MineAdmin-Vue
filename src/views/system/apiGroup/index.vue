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
  import apiGroup from '@/api/system/apiGroup'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const changeStatus = async (status, id) => {
    const response = await apiGroup.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: apiGroup.getList,
    recycleApi: apiGroup.getRecycleList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 160,
    add: { show: true, api: apiGroup.save, auth: ['system:apiGroup:save'] },
    edit: { show: true, api: apiGroup.update, auth: ['system:apiGroup:update'] },
    delete: {
      show: true,
      api: apiGroup.deletes, auth: ['system:apiGroup:delete'],
      realApi: apiGroup.realDeletes, realAuth: ['system:apiGroup:realDeletes']
    },
    recovery: { show: true, api: apiGroup.recoverys, auth: ['system:apiGroup:recovery']},
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
      addDefaultValue: '1', width: 160
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false, width: 180
    },
    {
      title: '更新时间', dataIndex: 'updated_at', addDisplay: false, editDisplay: false, width: 180
    },
  ])
</script>

<script>
export default { name: 'system:apiGroup' }
</script>

<style scoped>

</style>