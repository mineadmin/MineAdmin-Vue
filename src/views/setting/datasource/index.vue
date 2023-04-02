<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
      <template #operationBeforeExtend="{ record }">
        <a-link @click="testLinkDataSource(record)"><icon-link /> 测试连接</a-link>
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
  operationWidth: 180,
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
    title: "数据库驱动",
    dataIndex: "db_driver",
    formType: "select",
    commonRules: {
      required: true,
      message: "请选择数据库驱动"
    },
    dict: {
      data: [ { label: 'Mysql', value: 'mysql' } ]
    },
  },
  {
    title: "数据库地址",
    dataIndex: "db_host",
    formType: "input",
    commonRules: {
      required: true,
      message: "请选择数据库驱动"
    },
  },
  {
    title: "数据库端口",
    dataIndex: "db_port",
    formType: "input",
    commonRules: {
      required: true,
      message: "请输入数据库驱动"
    },
    addDefaultValue: '3306'
  },
  {
    title: "数据库名称",
    dataIndex: "db_name",
    formType: "input",
    commonRules: {
      required: true,
      message: "请输入数据库名称"
    },
  },
  {
    title: "数据库用户",
    dataIndex: "db_user",
    formType: "input",
    commonRules: {
      required: true,
      message: "请输入数据库用户"
    },
    addDefaultValue: 'root',
  },
  {
    title: "数据库密码",
    dataIndex: "db_pass",
    formType: "input-password",
    hide: true,
  },
  {
    title: "数据库字符集",
    dataIndex: "db_charset",
    formType: "select",
    dict: {
      data: [ { label: 'utf8mb4', value: 'utf8mb4'} ]
    },
    commonRules: {
      required: true,
      message: "请选择数据库字符集"
    },
    addDefaultValue: 'utf8mb4'
  },
  {
    title: "数据库字符序",
    dataIndex: "db_collation",
    formType: "select",
    dict: {
      data: collationData,
    },
    commonRules: {
      required: true,
      message: "请选择数据库字符序"
    },
    addDefaultValue: 'utf8mb4_unicode_ci'
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
    formType: "textarea",
    hide: true
  }
])
</script>
<script> export default { name: 'setting:datasource' } </script>