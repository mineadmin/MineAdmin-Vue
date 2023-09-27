<template>
  <div class="ma-content-block p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-link @click="testLinkDataSource(record)"><icon-link /> 测试连接</a-link>
      </template>
      <template #tools>
        <a-tooltip content="目前仅支持 Mysql 数据库">
          <a-button shape="circle"><icon-question-circle /></a-button>
        </a-tooltip>
      </template>
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import datasource from '@/api/setting/datasource'
import { Message } from '@arco-design/web-vue'

const crudRef = ref()

const testLinkDataSource = async (record) => {
  Message.info('测试连接中，请稍等...')
  const response = await datasource.testLink({ id: record.id })
  if (response.success) {
    Message.success('数据源连接成功');
  }
}

const collationData = reactive([
  { label: 'utf8mb4_bin', value: 'utf8mb4_bin' },
  { label: 'utf8mb4_general_ci', value: 'utf8mb4_general_ci' },
  { label: 'utf8mb4_unicode_ci', value: 'utf8mb4_unicode_ci' },
])

const options = reactive({
  id: 'setting_datasource',
  rowSelection: {
    showCheckedAll: true
  },
  pk: 'id',
  operationColumn: true,
  operationColumnWidth: 180,
  searchLabelWidth: '100px',
  labelWidth: '120px',
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
  },
  {
    title: "数据源名称",
    dataIndex: "source_name",
    formType: "input",
    search: true,
    commonRules: {
      required: true,
      message: "请输入数据源名称"
    },
    width: 120,
  },
  {
    title: "DSN连接串",
    dataIndex: "dsn",
    formType: "textarea",
    commonRules: {
      required: true,
      message: "请输入DSN连接串"
    },
    width: 350,
    addDefaultValue: 'mysql:host=数据库地址;dbname=数据库名称;port=3306;charset=utf8mb4',
    extra: '例如，mysql:host=myhost;dbname=mydb;port=3306'
  },
  {
    title: "数据库用户",
    dataIndex: "username",
    formType: "input",
    commonRules: {
      required: true,
      message: "请输入数据库用户"
    },
    width: 120,
    addDefaultValue: 'root',
  },
  {
    title: "数据库密码",
    dataIndex: "password",
    formType: "input-password",
    hide: true,
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
    showTime: true,
    width: 180,
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
    formType: "textarea",
    hide: true
  }
])
</script>
<script> export default { name: 'setting:datasource' } </script>