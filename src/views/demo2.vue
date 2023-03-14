<template>
  <div class="ma-content-block p-5"><ma-form v-model="form" :options="options" :columns="columns" /></div>
</template>
<script setup>
import { ref } from 'vue'

const form = ref({})
const options = ref({})
const columns = ref([
  {
    formType: 'tabs',
    customClass: ['mb-2'],
    tabs: [
      {
        title: '基础信息',
        formList: [{ formType: 'divider', title: '基础信息'}]
      },
      {
        title: '规格库存',
      },
    ]
  }
])

</script>