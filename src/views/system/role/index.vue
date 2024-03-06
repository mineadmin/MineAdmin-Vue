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
          @change="changeStatus($event, record)"
          :default-checked="record.status == 1"
        />
      </template>
      <!-- 操作列 -->
      <template #operationCell="{ record }">
        <div v-if="record.code === 'superAdmin'"></div>
      </template>
      <!-- 操作前置插槽 -->
      <template #operationBeforeExtend="{ record }">
        <a-space size="mini" v-if="record.code !== 'superAdmin' && ! isRecovery">
            <a-link @click="openMenuList(record)"><icon-menu /> 菜单权限</a-link>
            <a-link @click="openDataScopeList(record)"><icon-layers /> 数据权限</a-link>
        </a-space>
      </template>
    </ma-crud>

    <menu-permission ref="mpRef" @success="() => crudRef.refresh()" />

    <data-permission ref="dpRef" @success="() => crudRef.refresh()" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import role from '@/api/system/role'
  import { Message } from '@arco-design/web-vue'
  import MenuPermission from './components/menuPermission.vue'
  import DataPermission from './components/dataPermission.vue'

  const crudRef = ref()
  const mpRef = ref()
  const dpRef = ref()

  let isRecovery = computed(() => crudRef.value ? crudRef.value.isRecovery : false )

  const openMenuList = (record) => {
    mpRef.value.open(record)
  }

  const openDataScopeList = (record) => {
    dpRef.value.open(record)
  }

  const changeStatus = async (status, record) => {
    if (record.code === 'superAdmin') {
      Message.info('超级管理员角色不能禁用')
      return
    }
    const response = await role.changeStatus({ id: record.id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const changeSort = async (value, id) => {
    if (id === 1) {
      Message.info('超级管理员不能修改')
      return
    }
    const response = await role.numberOperation({ id, numberName: 'sort', numberValue: value })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: role.getPageList,
    recycleApi: role.getRecyclePageList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 300,
    add: { show: true, api: role.save, auth: ['system:role:save'] },
    edit: { show: true, api: role.update, auth: ['system:role:update'] },
    delete: {
      show: true,
      api: role.deletes, auth: ['system:role:delete'],
      realApi: role.realDeletes, realAuth: ['system:role:realDeletes']
    },
    recovery: { show: true, api: role.recoverys, auth: ['system:role:recovery']},
    isDbClickEdit: false,
    beforeOpenEdit: (record) => {
      if (record.id === 1) {
        Message.error('超级管理员角色不可编辑')
        return false
      }
      return true
    },
    beforeDelete: (ids) => {
      if (ids.includes(1)) {
        Message.error('超级管理员角色不可删除')
        return false
      }
      return true
    }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { 
      title: '角色名称', dataIndex: 'name', search: true, commonRules: [{ required: true, message: '角色名称必填' }], width: 220
    },
    { 
      title: '角色标识', dataIndex: 'code', search: true, commonRules: [{ required: true, message: '角色标识必填' }], width: 180
    },
    {
      title: '排序', dataIndex: 'sort', formType: 'input-number', addDefaultValue: 1, width: 180,
      min: 0, max: 1000,
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
      width: 200, search: true, formType: 'range'
    },
  ])
</script>

<script>
export default { name: 'system:role' }
</script>

<style scoped>

</style>