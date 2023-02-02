<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <MaNewForm v-model="form" :columns="columns">
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MaNewForm from '@cps/ma-newForm/index.vue'

const form = ref({})

const columns = ref([
  {
    dataIndex: 'tabs-1',
    formType: 'tabs',
    options: {
      tabs: [
        {
          title: 'aaa',
        },
        {
          title: 'bbb',
        },
        {
          title: 'ccc',
        }
      ]
    }
  }
])

</script>