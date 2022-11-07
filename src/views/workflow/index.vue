<template>
  <div class="ma-content-block p-3">
    <a-tabs :default-active-key="1">
      <a-tab-pane key="1" title="基础信息">
        <ma-form v-model="form" :columns="columnsOption" @submit="submit">

        </ma-form>
        {{ form }}
      </a-tab-pane>
      <a-tab-pane key="2" title="审批表单">
        Content of Tab Panel 2
      </a-tab-pane>
      <a-tab-pane key="3" title="流程设计">
        Content of Tab Panel 3
      </a-tab-pane>
      <a-tab-pane key="4" title="扩展信息">
        Content of Tab Panel 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = ref({})

const submit = (a ,b) => {
  console.log(a, b)
}

const columnsOption = reactive([
  {
    title: '真实姓名',
    dataIndex: 'realName',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    formType: 'radio',
    dict: {
      data: [{label: '保密', value: 0 }, {label: '男', value: 1 }, {label: '女', value: 2 }]
    },
  },
  {
    title: '销售明细',
    dataIndex: 'sells',
    formType:'form-group',
    children: [
      {
        title: '产品名称',
        dataIndex: 'proName',
        rules: [{ required: true, message: '请输入产品名称'}]
      },
      {
        title: '产品价格',
        dataIndex: 'price',
        formType: 'input-number'
      },
      {
        title: '产品图片',
        dataIndex: 'image',
        formType: 'upload'
      }
    ]
  }
])

</script>