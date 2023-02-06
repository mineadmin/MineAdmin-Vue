<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm v-model="form" :columns="columns" :options="options" ref="aaa">
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MaNewForm from "@cps/ma-newForm/index.vue";

const form = ref({});
const aaa = ref();
const options = ref({
  labelAlign: "right",
});
const columns = ref([{
  formType: 'tabs',
  tabs: [
    {
      formList: [ { formType: 'card', title: '卡片', formList: [ {
        title: '标题', dataIndex: 'title', formType: 'select',
        dict: {name: 'data_status'},
      } ] } ]
    },
    {
      formList: [ { formType: 'card', title: '卡片2', formList: [ { title: '标题2', dataIndex: 'title2', formType: 'input' } ] } ]
    }
  ]
}])
</script>
