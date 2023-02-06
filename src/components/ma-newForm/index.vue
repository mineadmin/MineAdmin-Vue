<template>
  <div class="w-full">
    <a-spin :loading="formLoading" :tip="props.options?.loadingText ?? '加载中...'" class="w-full">
      <a-form
        ref="maFormRef"
        :model="form"
        :class="[options?.customClass]" class="ma-form"
        :label-align="options?.labelAlign"
        :layout="options?.layout"
        :size="options?.size"
        :disabled="options?.disabled"
        :rules="options?.rules"
        @submit="formSubmit"
      >
        <template v-for="(component, componentIndex) in columns" :key="componentIndex">
          <component
            :is="getComponentName(component?.formType ?? 'input')"
            :component="component"
          >
            <template v-for="slot in Object.keys($slots)" #[slot]="component" >
              <slot :name="slot" v-bind="component" />
            </template>
          </component>
        </template>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, reactive, watch, provide, onMounted, getCurrentInstance } from 'vue'
import { isString, isFunction } from 'lodash'
import defaultOptions from './js/defaultOptions.js'
import { getComponentName, toHump } from './js/utils.js'
import { maEvent } from './js/formItemMixin.js'

import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'

const containerList = import.meta.globEager('./containerItem/*.vue')
const componentList = import.meta.globEager('./formItem/*.vue')
const _this = getCurrentInstance().appContext
for (const path in containerList) {
  const name = path.match(/([A-Za-z0-9_-]+)/g)[1]
  const containerName = `Ma${toHump(name)}`
  if (! _this.components[containerName]) {
    _this.app.component(containerName, containerList[path].default)
  }
}

for (const path in componentList) {
  const name = path.match(/([A-Za-z0-9_-]+)/g)[1]
  const componentName = `Ma${toHump(name)}`
  if (! _this.components[componentName]) {
    _this.app.component(componentName, componentList[path].default)
  }
}

const formLoading = ref(false)
const maFormRef = ref()
const form = ref({})

const props = defineProps({
  modelValue: Object,
  columns: { type: Array },
  options: { type: Object, default: () => {} },
})
const emit = defineEmits(['onSubmit', 'update:modelValue'])

watch(
  () => form.value,
  vl => emit('update:modelValue', vl),
  { deep: true }
)

const options = ref(Object.assign(defaultOptions, props.options))
provide('options', options.value)
provide('formModel', form.value)

maEvent.handleCommonEvent(options.value, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(options.value, 'onMounted')
})

const validateForm = async () => {
  const validResult = await maFormRef.value.validate()
}

const formSubmit = async () => {
  if ( await validateForm() ) {
    emit('onSubmit', form.value)
  }
}

const getFormRef = () => maFormRef.value
defineExpose({ getFormRef, validateForm })
</script>