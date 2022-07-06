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
  <div class="ma-content-block lg:h-full lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
      <!-- 排序列 -->
      <template #sort="{ record }">
        <a-input-number :default-value="record.sort" mode="button" @change="changeSort($event, record.id)" />
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
      <!-- 操作前置插槽 -->
      <template #operationBeforeExtend>
        <a-space size="mini">
            <a-link><icon-menu /> 菜单权限</a-link>
            <a-link><icon-layers /> 数据权限</a-link>
        </a-space>
      </template>
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import role from '@/api/system/role'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const changeStatus = async (status, id) => {
    const response = await role.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const changeSort = async (value, id) => {
    const response = await role.numberOperation({ id, numberName: 'sort', numberValue: value })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: role.getPageList,
    recycleApi: role.getRecyclePageList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 300,
    add: { show: true, api: role.save, auth: ['system:role:add'] },
    edit: { show: true, api: role.update, auth: ['system:role:edit'] },
    delete: {
      show: true,
      api: role.deletes, auth: ['system:role:delete'],
      realApi: role.realDeletes, realAuth: ['system:role:realDeletes']
    },
    recovery: { show: true, api: role.recoverys, auth: ['system:role:recovery']},
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
    { 
      title: '角色名称', dataIndex: 'name', search: true, rules: [{ required: true, message: '角色名称必填' }], width: 220
    },
    { 
      title: '角色标识', dataIndex: 'code', search: true, rules: [{ required: true, message: '角色标识必填' }], width: 180
    },
    {
      title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 100
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
      search: true, formType: 'range'
    },
  ])
</script>

<script>
export default { name: 'system:role' }
</script>

<style scoped>

</style>