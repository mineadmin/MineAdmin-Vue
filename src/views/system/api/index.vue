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
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link @click="openDoc(record)"><icon-book /> 文档</a-link>
        <a-link @click="bindApi(record.id)"><icon-pushpin /> 绑定</a-link>
      </template>
    </ma-crud>

  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import app from '@/api/system/app'
  import { Message, Modal } from '@arco-design/web-vue'

  const crudRef = ref()
  const bindRef = ref()

  const openDoc = (row) => {
    window.open(
      window.location.origin + '/#/mineDoc?app_id=' + row.app_id + '&app_secret=' + row.app_secret
    )
  }

  const bindApi = (id) => {
    bindRef.value.open(id)
  }

  const changeStatus = async (status, id) => {
    const response = await app.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const defaultResponse = `{
  code: 200,
  success: true,
  message: '请求成功',
  data: []
}`

  const crud = reactive({
    api: app.getList,
    recycleApi: app.getRecycleList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 280,
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
      formType: 'select', dict: { url: 'system/apiGroup/list', props: { label: 'name', value: 'id' }, translation: true },
      span: 12, width: 140,
    },
    { 
      title: '接口名称', dataIndex: 'app_name', search: true, rules: [{ required: true, message: '应用名称必填' }],
      span: 12, width: 150,
    },
    { 
      title: '访问名称', dataIndex: 'access_name', search: true, span: 12, width: 140,
      rules: [{ required: true, message: '访问名称必填' }],
      formExtra: '接口实际访问的路由，可以使用"."来区分层级，不支持"/"'
    },
    { 
      title: '请求模式', dataIndex: 'request_mode', search: true, formType: 'select',
      rules: [{ required: true, message: '请求模式必选' }],
      dict: { name: 'request_mode', props: { label: 'title', value: 'key' }, translation: true },
      span: 12, width: 140,
    },
    { 
      title: '类名称', dataIndex: 'class_name', rules: [{ required: true, message: '类名称必填' }],
      span: 12, width: 150,
    },
    { 
      title: '方法名称', dataIndex: 'method_name', rules: [{ required: true, message: '方法名称必填' }],
      span: 12, width: 150,
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 80, span: 12,
    },
    {
      title: '认证模式', dataIndex: 'auth_mode', formType: 'radio',
      dict: { data: [{ label: '简易模式', code: 1 }, { label: '复杂模式', code: 2 }], translation: true },
      addDefaultValue: 1, width: 130, span: 12,
    },
    {
      title: '应用介绍', dataIndex: 'description', hide: true, formType: 'editor',
    },
    {
      title: '返回示例', dataIndex: 'response', hide: true, formType: 'code-editor', height: 300,
      addDefaultValue: defaultResponse, readonly: true
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
      width: 180,
    },
  ])
</script>

<script>
export default { name: 'system:api' }
</script>

<style scoped>

</style>