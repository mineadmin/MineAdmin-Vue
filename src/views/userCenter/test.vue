<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm v-model="form" :columns="columns" :options="options">
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MaNewForm from '@cps/ma-newForm/index.vue'

const form = ref({})
const options = ref({
})
const columns = ref([
  {
    formType: 'tabs',
    options: {
      trigger: 'hover',
      tabs: [
        {
          title: '啦啦啦',
          childrenForm: [
            { title: 'aaa', formType: 'input-number', dataIndex: 'title' , type: 'button'}
          ]
        },
        {
          title: '哈哈哈',
          childrenForm: [
            { title: 'bbb', formType: 'tabs', options: { tabs: [ {
              childrenForm: [ { title: 'bbb', formType: 'input', dataIndex: 'ooo' } ]
            }, {} ] } }
          ]
        },
        {
          title: 'fuck',
        }
      ]
    }
  }
])

</script>