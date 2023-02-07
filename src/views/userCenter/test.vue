<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm v-model="form" :columns="columns" :options="options" ref="aaa">
      <template #switchChecked-ld>
        On
      </template>
      <template #switchUnchecked-ld>
        Off
      </template>
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
const columns = ref([
  {
    formType: "tabs",
    dataIndex: 'tabs',
    tabs: [
      {
        formList: [{
                title: "联动1",
                dataIndex: "ld",
                formType: "switch",
              },{
                title: "inpt",
                dataIndex: "in",
                formType: "input",
                openSuffix: true,
              }]
      }
    ]
  }
])
</script>
