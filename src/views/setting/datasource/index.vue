<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import datasource from '@/api/setting/datasource'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()

const options = reactive({
  id: 'setting_datasource',
  rowSelection: {
    showCheckedAll: true
  },
  pk: 'id',
  operationColumn: true,
  operationWidth: 130,
  searchLabelWidth: '100px',
  labelWidth: '130px',
  searchColNumber: 2,
  formOption: {
    viewType: 'modal',
    width: 600
  },
  api: datasource.getList,
  add: {
    show: true,
    api: datasource.save,
    auth: ['setting:datasource:save']
  },
  edit: {
    show: true,
    api: datasource.update,
    auth: ['setting:datasource:update']
  },
  delete: {
    show: true,
    api: datasource.deletes,
    auth: ['setting:datasource:delete']
  },
  import: {
    show: true,
    url: 'setting/datasource/import',
    templateUrl: 'setting/datasource/downloadTemplate',
    auth: ['setting:datasource:import']
  },
  export: {
    show: true,
    url: 'setting/datasource/export',
    auth: ['setting:datasource:export']
  }
})

const columns = reactive([
  {
    title: "主键",
    dataIndex: "id",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    commonRules: {
      required: true,
      message: "请输入主键"
    }
  },
  {
    title: "数据源名称",
    dataIndex: "name",
    formType: "input",
    search: true,
    commonRules: {
      required: true,
      message: "请输入数据源名称"
    }
  },
  {
    title: "数据库地址",
    dataIndex: "db_host",
    formType: "input",
  },
  {
    title: "数据库端口",
    dataIndex: "db_port",
    formType: "input",
  },
  {
    title: "数据库名称",
    dataIndex: "db_name",
    formType: "input",
  },
  {
    title: "数据库用户",
    dataIndex: "db_user",
    formType: "input",
  },
  {
    title: "数据库密码",
    dataIndex: "db_pass",
    formType: "input",
    hide: true,
  },
  {
    title: "数据库字符集",
    dataIndex: "db_charset",
    formType: "input",
  },
  {
    title: "数据库字符序",
    dataIndex: "db_collation",
    formType: "input",
  },
  {
    title: "创建者",
    dataIndex: "created_by",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true
  },
  {
    title: "更新者",
    dataIndex: "updated_by",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    formType: "date",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    showTime: true
  },
  {
    title: "更新时间",
    dataIndex: "updated_at",
    formType: "date",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    showTime: true
  },
  {
    title: "备注",
    dataIndex: "remark",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true
  }
])
</script>
<script> export default { name: 'setting:datasource' } </script>