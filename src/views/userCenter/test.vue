<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm v-model="form" :columns="columns" :options="options">
        <template #tabPanel-ok-a-title><icon-user />嘿嘿</template>
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MaNewForm from '@cps/ma-newForm/index.vue'

const form = ref({})
const options = ref({
  labelAlign: 'right'
})
const columns = ref([
  {
    dataIndex: 'ok',
    formType: 'tabs',
    options: {
      trigger: 'hover',
      tabs: [
        {
          title: '啦啦啦',
          key: 'a',
          childrenForm: [
            {
              title: 'aaa', formType: 'input', dataIndex: 'title' , type: 'button',
            }
          ]
        },
        {
          title: '哈哈哈',
          key:'c',
          childrenForm: [
            { title: 'bbb', formType: 'tabs', options: { tabs: [ {
              childrenForm: [ { title: 'bbb', formType: 'input-number', dataIndex: 'ooo' } ]
            }, {} ] } }
          ]
        },
      ]
    }
  }
  // {
  //   formType: 'card',
  //   options: {
  //     title: '啦啦啦',
  //     childrenForm: [
  //       {
  //         title: 'aaa', formType: 'input', dataIndex: 'title' , type: 'button',
  //       }
  //     ]
  //   }
  // }
])

</script>