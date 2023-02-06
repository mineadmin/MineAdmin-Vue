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
  title: '标题', dataIndex: 'title', formType: 'input'
}])
</script>
