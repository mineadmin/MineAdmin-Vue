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
const info = ref(
  [3,4 ]
)
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
          title: "用户名",
          dataIndex: "userinfo",
          formType: "icon-picker",
        },{
          title: "颜色选择器",
          dataIndex: "color",
          formType: "city-linkage",
          type:'select'
        },{
          title: "验证码",
          dataIndex: "code",
          formType: "verify-code",
        }]
      }
    ]
  }
])
</script>
