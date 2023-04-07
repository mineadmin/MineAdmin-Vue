<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import demoExample1 from '@/api/demo/demoExample1'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()

const options = reactive({
  rowSelection: {
    showCheckedAll: true
  },
  pk: 'id',
  operationColumn: true,
  operationWidth: 160,
  formOption: {
    viewType: 'modal',
    width: 600
  },
  api: demoExample1.getList,
  add: {
    show: true,
    api: demoExample1.save,
    auth: ['demo:example1:save']
  },
  edit: {
    show: true,
    api: demoExample1.update,
    auth: ['demo:example1:update']
  },
  delete: {
    show: true,
    api: demoExample1.deletes,
    auth: ['demo:example1:delete']
  },
  import: {
    show: true,
    url: 'demo/example1/import',
    templateUrl: 'demo/example1/downloadTemplate',
    auth: ['demo:example1:import']
  },
  export: {
    show: true,
    url: 'demo/example1/export',
    auth: ['demo:example1:export']
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
    title: "分类ID",
    dataIndex: "type_id",
    formType: "select",
    search: true,
    commonRules: {
      required: true,
      message: "请输入分类ID"
    },
    sortable: {
      sortDirections: [
        "ascend",
        "descend"
      ],
      sorter: true
    },
    multiple: false,
    dict: {
      data: [
        {
          label: "后台类",
          value: "1"
        },
        {
          label: "前台类",
          value: "2"
        },
        {
          label: "功能模块",
          value: "3"
        },
        {
          label: "主题模板",
          value: "4"
        }
      ],
      translation: true
    }
  },
  {
    title: "分类名称",
    dataIndex: "title",
    formType: "input",
    search: true,
    commonRules: {
      required: true,
      message: "请输入分类名称"
    }
  },
  {
    title: "图片",
    dataIndex: "image",
    formType: "upload",
    type: "image",
    multiple: false,
    onlyData: true,
    returnType: "url",
    chunk: false,
    commonRules: {
      required: true,
      message: "请上传图片"
    }
  },
  {
    title: "是否隐藏",
    dataIndex: "hidden",
    formType: "radio",
    search: true,
    commonRules: {
      required: true,
      message: "请输入是否隐藏"
    },
    addDefaultValue: 2,
    dict: {
      data: [
        {
          label: "是",
          value: "1"
        },
        {
          label: "否",
          value: "2"
        }
      ],
      translation: true
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    formType: "radio",
    search: true,
    addDefaultValue: 1,
    commonRules: {
      required: true,
      message: "请输入状态"
    },
    dict: {
      name: "data_status",
      props: {
        label: "title",
        value: "key"
      },
      translation: true
    }
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    formType: "date",
    addDisplay: false,
    editDisplay: false,
    showTime: true
  },
  {
    title: "更新时间",
    dataIndex: "updated_at",
    formType: "date",
    addDisplay: false,
    editDisplay: false,
    showTime: true
  }
])
</script>
<script> export default { name: 'demo:example1' } </script>