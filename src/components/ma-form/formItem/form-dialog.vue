<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <maDialog v-model:visible="visible" :footer="false" />
</template>
  
<script setup>
import { onMounted, inject, ref, h, computed } from 'vue'
import { runEvent } from '../js/event.js'
import { Modal, Drawer } from '@arco-design/web-vue'
import MaForm from '@/components/ma-form/index.vue'
import { isFunction } from 'lodash'
const props = defineProps({
  component: Object,
})

const visible = ref(false)
const openDialog = () => visible.value = true
const getDataIndex = () => props.component?.dataIndex

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)

const form = computed({
  get() {
    return formModel.value[getDataIndex()]
  },
  set(newVal) {
    formModel.value[getDataIndex()] = newVal
  }
})

const maDialog = (p, ctx) => {
  const componentProps = { formList: {}, options: {} }
  const evs = {}
  Object.keys(props.component).map(key => {
    if (! /^on[A-Za-z]+/g.test(key)) {
      componentProps[key] = props.component[key]
    } else {
      if (isFunction(props.component[key])) {
        evs[key] = function() {
          const argsList = Array.prototype.slice.call(arguments)
          props.component[key](...argsList, { formModel, getColumnService, columns })
        }
      } else {
        evs[key] = function() {
          const argsList = Array.prototype.slice.call(arguments)
          rv(key, { ...argsList })
        }
      }
    }
  })
  return h(
    componentProps?.type === 'drawer' ? Drawer : Modal,
    {
      ...Object.assign(componentProps, p),
      ...evs
    },
    {
      default: () => h(
        MaForm,
        {
          columns: componentProps.formList,
          options: Object.assign(componentProps.options),
          modelValue: form.value,
          onSubmit: async (data, done) => await rv('onSubmit', { data, done })
        },
        componentProps?.formSlot,
      ),
      ...componentProps?.dialogSlot,
    }
  )
}

rv('onCreated')
onMounted(() => rv('onMounted'))

defineExpose({ openDialog, getDataIndex })
</script>