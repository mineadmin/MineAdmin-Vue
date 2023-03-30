<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import demoQa from '@/api/demo/demoQa'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()

const options = reactive({
  id: 'qa',
  rowSelection: {
    showCheckedAll: true
  },
  pk: 'id',
  operationColumn: true,
  operationWidth: 160,
  formOption: {
    viewType: 'tag',
    tagId: 'question',
    tagName: '问答',
    titleDataIndex: 'title',
    layout: [
      {
        formType: 'tabs',
        tabs: [
          {
            title: '基础信息',
            formList: [
              { dataIndex: 'title' },
              { dataIndex: 'type_id' },
              { dataIndex: 'tags' },
              { dataIndex: 'status' },
              { dataIndex: 'good_number' },
              { dataIndex: 'comment_number' },
            ]
          },
          {
            title: '问答内容',
            formList: [ { dataIndex: 'desc' }, { dataIndex: 'content' } ]
          }
        ]
      }
    ]
  },
  api: demoQa.getList,
  add: {
    show: true,
    api: demoQa.save,
    auth: ['demo:qa:save']
  },
  edit: {
    show: true,
    api: demoQa.update,
    auth: ['demo:qa:update']
  },
  delete: {
    show: true,
    api: demoQa.deletes,
    auth: ['demo:qa:delete']
  },
  import: {
    show: true,
    url: 'demo/qa/import',
    templateUrl: 'demo/qa/downloadTemplate',
    auth: ['demo:qa:import']
  },
  tabs: {
    data: () => {
      return [
        { label: '全部', value: undefined },
        { label: '求助', value: 1 },
        { label: '提问', value: 2 },
        { label: '悬赏', value: 3 },
      ]
    },
    defaultKey: undefined,
    searchKey: 'type_id',
  },
  export: {
    show: true,
    url: 'demo/qa/export',
    auth: ['demo:qa:export']
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
    title: "问答分类",
    dataIndex: "type_id",
    formType: "select",
    commonRules: {
      required: true,
      message: "请输入问答分类"
    },
    dict: {
      data: [
        {
          label: "求助",
          value: "1"
        },
        {
          label: "提问",
          value: "2"
        },
        {
          label: "悬赏",
          value: "3"
        }
      ],
      translation: true
    }
  },
  {
    title: "标题",
    dataIndex: "title",
    formType: "input",
    search: true,
    commonRules: {
      required: true,
      message: "请输入标题"
    }
  },
  {
    title: "简介",
    dataIndex: "desc",
    formType: "textarea",
    hide: true,
    commonRules: {
      required: true,
      message: "请输入简介"
    }
  },
  {
    title: "问答标签",
    dataIndex: "tags",
    formType: "input-tag",
    search: true,
    hide: true,
    extra: '按下 Enter 键，代表一个标签'
  },
  {
    title: "内容",
    dataIndex: "content",
    formType: "editor",
    hide: true,
    commonRules: {
      required: true,
      message: "请输入内容"
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    formType: "radio",
    search: true,
    commonRules: {
      required: true,
      message: "请输入状态"
    },
    addDefaultValue: 1,
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
    title: "点赞数",
    dataIndex: "good_number",
    formType: "input-number",
    addDefaultValue: 0,
  },
  {
    title: "评论数",
    dataIndex: "comment_number",
    formType: "input-number",
    addDefaultValue: 0,
  },
  {
    title: "发布人",
    dataIndex: "created_by",
    formType: "input",
    addDisplay: false,
    editDisplay: false
  },
  {
    title: "更新人",
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
  }
])
</script>
<script> export default { name: 'demo:qa' } </script>