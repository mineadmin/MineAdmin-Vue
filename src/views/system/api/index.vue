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
      <template #operationBeforeExtend="{ record }" v-if="! isRecovery">
        <a-link @click="openParamsList(record, 'response')"><icon-left /> 出参</a-link>
        <a-link @click="openParamsList(record, 'request')"><icon-right /> 入参</a-link>
      </template>
    </ma-crud>

    <params-list ref="paramslist" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import api from '@/api/system/api'
  import { Message } from '@arco-design/web-vue'
  import ParamsList from './paramsList.vue'

  const crudRef = ref()
  const paramslist = ref()

  let isRecovery = computed(() => crudRef.value ? crudRef.value.isRecovery : false )

  const changeStatus = async (status, id) => {
    const response = await api.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const openParamsList = (row, type) => {
    paramslist.value.open(row, type)
  }

  const defaultResponse = `{
  code: 200,
  success: true,
  message: '请求成功',
  data: []
}`

  const crud = reactive({
    api: api.getList,
    recycleApi: api.getRecycleList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 260,
    add: { show: true, api: api.save, auth: ['system:api:add'] },
    edit: { show: true, api: api.update, auth: ['system:api:update'] },
    delete: {
      show: true,
      api: api.deletes, auth: ['system:api:delete'],
      realApi: api.realDeletes, realAuth: ['system:api:realDeletes']
    },
    recovery: { show: true, api: api.recoverys, auth: ['system:api:recovery']},
    viewLayoutSetting: {
      layout: 'customer', width: '850px'
    }
  })

  const columns = reactive([
    {
      title: '所属组', dataIndex: 'group_id', search: true, rules: [{ required: true, message: '所属组必选' }],
      formType: 'select', dict: { url: 'system/apiGroup/list', props: { label: 'name', value: 'id' }, translation: true },
      span: 12, width: 140,
    },
    {
      title: '接口名称', dataIndex: 'name', search: true, rules: [{ required: true, message: '应用名称必填' }],
      span: 12, width: 150,
    },
    {
      title: '访问名称', dataIndex: 'access_name', span: 12, width: 140,
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
      addDefaultValue: defaultResponse,
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
