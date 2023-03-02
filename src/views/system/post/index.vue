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
  import post from '@/api/system/post'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const changeStatus = async (status, id) => {
    const response = await post.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const changeSort = async (value, id) => {
    const response = await post.numberOperation({ id, numberName: 'sort', numberValue: value })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: post.getPageList,
    recycleApi: post.getRecyclePageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 200,
    add: { show: true, api: post.save, auth: ['system:post:save'] },
    edit: { show: true, api: post.update, auth: ['system:post:update'] },
    delete: {
      show: true,
      api: post.deletes, auth: ['system:post:delete'],
      realApi: post.realDeletes, realAuth: ['system:post:realDeletes']
    },
    recovery: { show: true, api: post.recoverys, auth: ['system:post:recovery']},
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { 
      title: '岗位名称', dataIndex: 'name', search: true, width: 150,
      commonRules: [{ required: true, message: '岗位名称必填' }]
    },
    { 
      title: '岗位标识', dataIndex: 'code', search: true, width: 150,
      commonRules: [{ required: true, message: '岗位标识必填' }],
    },
    {
      title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
      min: 0, max: 1000
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 150,
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
      search: true, formType: 'range', width: 180,
    },
  ])
</script>

<script>
export default { name: 'system:post' }
</script>

<style scoped>

</style>