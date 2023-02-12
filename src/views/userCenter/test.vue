<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm v-model="form" :columns="columns" :options="options" @onSubmit="submitForm">
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MaNewForm from "@cps/ma-newForm/index.vue";

const submitForm = (data) => {
}

const form = ref(
)
const options = ref({
  labelAlign: "right",
});
const columns = ref([
  // {
  //   formType: "tabs",
  //   dataIndex: 'tabs',
  //   tabs: [
  //     {
  //       title: 'Tab布局',
  //       formList: [{
  //         title: "标题",
  //         dataIndex: "title",
  //         formType: "select",
  //         dict: { name:'data_status' },
  //         cascaderItem: ['title2']
  //       },{
  //         title: "标题2",
  //         dataIndex: "title2",
  //         formType: "select",
  //         dict: { url: 'system/common/cascader' }
  //       }]
  //     }
  //   ]
  // }
  {
    formType: 'resource',
    dataIndex: 'haha',
    type: 'button',
    title: '哈哈',
    multiple: true,
  },
  // {
  //   formType: "children-form",
  //   dataIndex: 'sub',
  //   type: 'table',
  //   title: '子表单哇塞',
  //   formList: [{
  //     title: "标题",
  //     dataIndex: "title",
  //     formType: "select",
  //     dict: { name: 'data_status' },
  //     cascaderItem: ['title2']
  //   },{
  //     title: "标题2",
  //     dataIndex: "title2",
  //     formType: "select",
  //     dict: { url: 'system/common/cascader' }
  //   }]
  // }
])
</script>
