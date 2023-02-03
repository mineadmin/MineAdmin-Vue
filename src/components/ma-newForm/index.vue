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
      >
        <template v-for="(component, componentIndex) in columns" :key="componentIndex">
          <component
            :is="getComponentName(component.formType)"
            :component="component"
          >
            <template v-for="slot in Object.keys($slots)" #[slot]="options" >
              <slot :name="slot" v-bind="options" />
            </template>
          </component>
        </template>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, reactive, watch, provide, getCurrentInstance, onMounted, nextTick } from 'vue'
import defaultOptions from './js/defaultOptions.js'
import { getComponentName, upperCaseFirst, containerItems } from './js/utils.js'

import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'

const containerList = import.meta.globEager('./containerItem/*.vue')
const componentList = import.meta.globEager('./formItem/*.vue')
const _this = getCurrentInstance().appContext
for (const path in containerList) {
  const name = path.match(/([A-Za-z0-9_-]+)/g)[1]
  const componentName = `Ma${upperCaseFirst(name)}`
  if (! _this.components[componentName]) {
    _this.app.component(componentName, containerList[path].default)
  }
}

for (const path in componentList) {
  const name = path.match(/([A-Za-z0-9_-]+)/g)[1]
  const componentName = (`Ma${upperCaseFirst(name)}`).replace('-', '')
  if (! _this.components[componentName]) {
    _this.app.component(componentName, componentList[path].default)
  }
}

const formLoading = ref(false)
const formRef = ref()
const form = ref({})

const props = defineProps({
  modelValue: Object,
  columns: { type: Array },
  options: { type: Object, default: () => {} },
})
const emit = defineEmits(['submit', 'update:modelValue'])

watch(
  () => form.value,
  vl => emit('update:modelValue', vl),
  { deep: true }
)

const options = ref(Object.assign(defaultOptions, props.options))
provide('options', options.value)
provide('formModel', form.value)
onMounted(() => {
  // 获取 $refs
  getCurrentInstance().ctx.$refs['maFormRef']
})
</script>