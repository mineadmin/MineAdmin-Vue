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

      <template #operationBeforeExtend="{ record }">
        <a-link @click="openLeaderModal(record)"><icon-user /> 领导列表</a-link>
      </template>
    </ma-crud>

    <leader-list ref="leaderRef" />
    
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import dept from '@/api/system/dept'
  import { Message } from '@arco-design/web-vue'
  import LeaderList from './leader.vue'

  const crudRef = ref()
  const leaderRef = ref()

  const changeStatus = async (status, id) => {
    const response = await dept.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const changeSort = async (value, id) => {
    const response = await dept.numberOperation({ id, numberName: 'sort', numberValue: value })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const openLeaderModal = (record) => {
    leaderRef.value.open(record)
  }

  const crud = reactive({
    api: dept.getList,
    recycleApi: dept.getRecycleList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 220,
    add: { show: true, api: dept.save, auth: ['system:dept:save'] },
    edit: { show: true, api: dept.update, auth: ['system:dept:update'] },
    delete: {
      show: true,
      api: dept.deletes, auth: ['system:dept:delete'],
      realApi: dept.realDeletes, realAuth: ['system:dept:realDeletes']
    },
    recovery: { show: true, api: dept.recoverys, auth: ['system:dept:recovery']},
    isExpand: true,
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
      title: '上级部门', dataIndex: 'parent_id', hide: true, formType: 'tree-select', 
      dict: { url: 'system/dept/tree' },
      editDefaultValue: (record) => {
        return record.parent_id == 0 ? undefined : record.parent_id
      }
    },
    { 
      title: '部门名称', dataIndex: 'name', search: true, width: 150,
      commonRules: [{ required: true, message: '部门名称必填' }],
    },
    { title: '负责人', dataIndex: 'leader', search: true, width: 120 },
    {
      title: '手机', dataIndex: 'phone', search: true, width: 150,
      commonRules: [{ match: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }]
    },
    {
      title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
      min: 0, max: 1000
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 120
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
export default { name: 'system:dept' }
</script>

<style scoped>

</style>