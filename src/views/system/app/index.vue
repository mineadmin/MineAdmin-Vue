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
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }" v-if="! isRecovery">
        <a-link @click="openDoc(record)"><icon-book /> 文档</a-link>
        <a-link @click="bindApi(record.id)"><icon-pushpin /> 绑定</a-link>
      </template>
    </ma-crud>

    <bind ref="bindRef" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed, nextTick } from 'vue'
  import app from '@/api/system/app'
  import { Message, Modal } from '@arco-design/web-vue'
  import Bind from './bind.vue'

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

  let isRecovery = computed(() => crudRef.value ? crudRef.value.isRecovery : false )

  const crud = reactive({
    api: app.getList,
    recycleApi: app.getRecycleList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 270,
    add: { show: true, api: app.save, auth: ['system:app:save'] },
    edit: { show: true, api: app.update, auth: ['system:app:update'] },
    delete: {
      show: true,
      api: app.deletes, auth: ['system:app:delete'],
      realApi: app.realDeletes, realAuth: ['system:app:realDeletes']
    },
    recovery: { show: true, api: app.recoverys, auth: ['system:app:recovery']},
    formOption: {
      width: '850px',
      layout: [
        { formType: 'grid', cols:
          [
            { span: 12, formList: [ { dataIndex: 'group_id' }] },
            { span: 12, formList: [{ dataIndex: 'app_name' }] }
          ]
        },
        { formType: 'grid', cols: 
          [
            { span: 18, formList: [ { dataIndex: 'app_id' }] },
            { span: 5, offset: 1, formList: [{ dataIndex: 'app_id_button' }] }
          ]
        },
        { formType: 'grid', cols: 
          [
            { span: 18, formList: [ { dataIndex: 'app_secret' }] },
            { span: 5, offset: 1, formList: [{ dataIndex: 'app_secret_button' }] }
          ]
        },
      ]
    }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
      title: '所属组', dataIndex: 'group_id', search: true, commonRules: [{ required: true, message: '所属组必选' }],
      formType: 'select', dict: { url: 'system/appGroup/list', props: { label: 'name', value: 'id' }, translation: true },
      labelWidth: '140px', width: 140 
    },
    {
      title: '应用名称', dataIndex: 'app_name', search: true, commonRules: [{ required: true, message: '应用名称必填' }],
      labelWidth: '120px', width: 150,
    },
    {
      title: 'APP ID', dataIndex: 'app_id', search: true, commonRules: [{ required: true, message: 'APP ID必填' }],
      labelWidth: '120px', disabled: true, width: 120,
      addDefaultValue: async () => {
        const res = await app.getAppId()
        return res.data.app_id
      }
    },
    {
      formType: 'button', dataIndex: 'app_id_button', hide: true,
      type: 'primary', title: '刷新APP ID', long: true,
      onClick: async () => {
        const form = crudRef.value.getFormData()
        if (crudRef.value.getCurrentAction() === 'edit') {
          Modal.info({
            simple: false,
            hideCancel: false,
            title: '提示',
            content: '此操作会造成已使用的应用验证失败，确定执行吗？',
            onOk: async () => {
              const res = await app.getAppId()
              form.app_id = res.data.app_id
            }
          })
          return
        }
        const res = await app.getAppId()
        form.app_id = res.data.app_id
      },
    },
    {
      title: 'APP SECRET', dataIndex: 'app_secret', commonRules: [{ required: true, message: 'APP SECRET必填' }],
      labelWidth: '120px', disabled: true, span: 19, width: 500,
      addDefaultValue: async () => {
        const res = await app.getAppSecret()
        return res.data.app_secret
      }
    },
    {
      formType: 'button', type: 'primary', title: '刷新APP SECRET', long: true,
      dataIndex: 'app_secret_button', hide: true,
      onClick: async () => {
        const form = crudRef.value.getFormData()
        if (crudRef.value.getCurrentAction() === 'edit') {
          Modal.info({
            simple: false,
            hideCancel: false,
            title: '提示',
            content: '此操作会造成已使用的应用验证失败，确定执行吗？',
            onOk: async () => {
              const res = await app.getAppSecret()
              form.app_secret = res.data.app_secret
            }
          })
          return
        }
        const res = await app.getAppSecret()
        form.app_secret = res.data.app_secret
      }
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 80,
    },
    {
      title: '应用介绍', dataIndex: 'description', hide: true, formType: 'editor',
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
export default { name: 'system:app' }
</script>

<style scoped>

</style>
