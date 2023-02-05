<template>
  <div class="ma-content-block p-4">
    <div>{{ form }}</div>
    <MaNewForm v-model="form" :columns="columns" :options="options" ref="aaa">
    </MaNewForm>
  </div>
</template>

<script setup>
import { ref, nextTick, getCurrentInstance } from 'vue'
import MaNewForm from '@cps/ma-newForm/index.vue'

const form = ref({})
const aaa = ref()
const options = ref({
  labelAlign: 'right'
})
const columns = ref([
  // {
  //   dataIndex: 'ok',
  //   formType: 'tabs',
  //   trigger: 'hover',
  //   tabs: [
  //     {
  //       title: '啦啦啦',
  //       key: 'a',
  //       childrenForm: [
  //         {
  //           title: 'aaa', formType: 'input', dataIndex: 'title' , type: 'button',
  //           onInput: 'alert(value)'
  //         }
  //       ]
  //     },
  //     {
  //       title: '哈哈哈',
  //       key:'c',
  //       childrenForm: [
  //         { title: 'bbb', formType: 'tabs', dataIndex: 'hahah', tabs: [ {
  //           childrenForm: [ { title: 'bbb', formType: 'input-number', dataIndex: 'ooo' } ]
  //         }, {} ] }
  //       ]
  //     },
  //   ]
  // }

  {
    formType: 'grid',
    cols: [
      {
        span: 16,
        childrenForm: [   {
    dataIndex: 'ok',
    formType: 'tabs',
    trigger: 'hover',
    tabs: [
      {
        title: '啦啦啦',
        key: 'a',
        childrenForm: [
          {
            title: 'aaa', formType: 'input', dataIndex: 'title' , type: 'button',
            onInput: 'alert(value)'
          }
        ]
      },
      {
        title: '哈哈哈',
        key:'c',
        childrenForm: [
          { title: 'bbb', formType: 'tabs', tabs: [ {
            childrenForm: [ { title: 'bbb', formType: 'input-number', dataIndex: 'ooo' } ]
          }, {} ] }
        ]
      },
    ]
  }]
      },
      {
        span: 8,
        childrenForm: [ {
          formType: 'card',
          title: '啦啦啦',
          childrenForm: [
            {
              formType: 'tabs',
              dataIndex: 'fuck',
              tabs: [ {
                childrenForm: [ {title: 'aaa', formType: 'input', dataIndex: 'title' }]
              }, {}, {} , {}]
            }
          ]
        }]
      }
    ]
  }
])

</script>