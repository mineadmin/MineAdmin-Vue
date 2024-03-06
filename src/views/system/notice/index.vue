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
    </ma-crud>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import notice from '@/api/system/notice'

  const crudRef = ref()

  const crud = reactive({
    api: notice.getPageList,
    recycleApi: notice.getRecyclePageList,
    showIndex: false,
    searchColNumber: 3,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 160,
    add: { show: true, api: notice.save, auth: ['system:notice:save'] },
    edit: { show: true, api: notice.update, auth: ['system:notice:update'] },
    delete: {
      show: true,
      api: notice.deletes, auth: ['system:notice:delete'],
      realApi: notice.realDeletes, realAuth: ['system:notice:realDeletes']
    },
    recovery: { show: true, api: notice.recoverys, auth: ['system:notice:recovery']},
    formOption: { width: 800 }
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    { 
      title: '公告标题', dataIndex: 'title', search: true, width: 500,
      commonRules: [{ required: true, message: '公告标题必填' }],
    },
    { 
      title: '公告类型', dataIndex: 'type', search: true, width: 180,
      commonRules: [{ required: true, message: '公告类型必选' }], formType: 'radio',
      dict: { name: 'backend_notice_type', props: { label: 'title', value: 'key' }, translation: true },
      addDefaultValue: 1
    },
    {
      title: '接收用户', dataIndex: 'users', formType: 'user-select', editDisplay: false, hide: true,
      formExtra: '如不选择，默认将为所有用户发送'
    },
    {
      title: '公告内容', dataIndex: 'content', formType: 'editor', hide: true,
      commonRules: [{ required: true, message: '公告内容必填' }]
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