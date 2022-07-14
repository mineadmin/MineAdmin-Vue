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
  import app from '@/api/system/app'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()

  const changeStatus = async (status, id) => {
    const response = await app.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const crud = reactive({
    api: app.getList,
    recycleApi: app.getRecycleList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 200,
    add: { show: true, api: app.save, auth: ['system:app:add'] },
    edit: { show: true, api: app.update, auth: ['system:app:edit'] },
    delete: {
      show: true,
      api: app.deletes, auth: ['system:app:delete'],
      realApi: app.realDeletes, realAuth: ['system:app:realDeletes']
    },
    recovery: { show: true, api: app.recoverys, auth: ['system:app:recovery']},
    viewLayoutSetting: {
      layout: 'customer', width: '850px'
    }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
    { 
      title: '所属组', dataIndex: 'group_id', search: true, rules: [{ required: true, message: '所属组必选' }],
      formType: 'select', dict: { url: 'system/appGroup/list', props: { label: 'name', value: 'id' } },
      span: 12, labelWidth: '140px'
    },
    { 
      title: '应用名称', dataIndex: 'name', search: true, rules: [{ required: true, message: '组名称必填' }],
      span: 12, labelWidth: '120px',
    },
    { 
      title: 'APP ID', dataIndex: 'app_id', search: true, rules: [{ required: true, message: 'APP ID必填' }],
      labelWidth: '120px', span: 19, disabled: true, 
    },
    { 
      labelWidth: '0px', span: 5, formType: 'button', type: 'primary', text: '刷新APP ID',
      click: (value, item) => {
        console.log(value, item)
      }
    },
    { 
      title: 'APP SECRET', dataIndex: 'app_secret', rules: [{ required: true, message: 'APP SECRET必填' }],
      labelWidth: '120px', disabled: true, span: 19,
    },
    { 
      labelWidth: '0px', span: 5, formType: 'button', type: 'primary', text: '刷新APP SECRET',
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1',
    },
    {
      title: '应用介绍', dataIndex: 'description', hide: true, formType: 'editor',
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
    },
  ])
</script>

<script>
export default { name: 'system:appGroup' }
</script>

<style scoped>

</style>