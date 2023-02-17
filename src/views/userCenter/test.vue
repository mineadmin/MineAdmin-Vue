<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm
      v-model="form"
      :columns="columns"
      :options="options"
      @onSubmit="submitForm"
    >
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MaNewForm from "@cps/ma-form/index.vue";
const submitForm = (data) => {};
const form = ref({});
const options = ref({
  labelAlign: "right",
});
const aaa = () => {
    alert(111)
}
const columns = ref([
  {
    title: "岗位名称",
    dataIndex: "name",
    formType: 'select',
    dict: { name: 'data_status'},
    rules: [{ required: true, message: "岗位名称必填" }],
  },
  {
    title: "岗位标识",
    dataIndex: "code",
    search: true,
    width: 150,
    // commonRules: [{ required: true, message: "岗位标识必填" }],
    display: true,
    disabled: false,
    readonly: false,
    rules: [{ required: true, message: "岗位标识必填" }],
  },
  {
    title: "排序",
    dataIndex: "sort",
    formType: "input-number",
    addDefaultValue: 1,
    width: 180,
    min: 0,
    max: 1000,
    display: true,
    disabled: false,
    readonly: false,
    rules: [],
  },
  {
    title: "状态",
    dataIndex: "status",
    search: true,
    formType: "radio",
    dict: { name: "data_status", props: { label: "title", value: "key" } },
    addDefaultValue: "1",
    width: 150,
    display: true,
    disabled: false,
    readonly: false,
    rules: [],
  },
  {
    title: "备注",
    dataIndex: "remark",
    hide: true,
    formType: "textarea",
    width: 100,
    display: true,
    disabled: false,
    readonly: false,
    rules: [],
  },
]);
</script>
