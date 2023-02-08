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

const form = ref({});
const options = ref({
  labelAlign: "right",
});
const columns = ref([
  {
    formType: "tabs",
    dataIndex: 'tabs',
    tabs: [
      {
        title: 'Tab布局',
        formList: [{
          title: "标题",
          dataIndex: "title",
          formType: "input",
          rules: [{ required: true, message: '请输入标题'}],
        },{
          title: "内容",
          dataIndex: "content",
          formType: "textarea",
        }]
      }
    ]
  }
])
</script>
