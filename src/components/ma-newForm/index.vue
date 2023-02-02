<template>
  <div class="w-full">
    <a-spin :loading="formLoading" tip="加载中..." class="w-full">
      <a-form
        ref="formRef"
        :model="form"
        :class="[options?.customClass]" class="ma-form"
        :label-align="options?.labelAlign"
        :layout="options?.layout"
        :size="options?.size"
        :disabled="options?.disabled"
        :rules="options?.rules"
      >
        <template v-for="(component, componentIndex) in columns" :key="componentIndex">
          <component :is="getComponentName(component.formType)" v-bind="component.options" :component="component">
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
import { ref, reactive, watch, provide, getCurrentInstance, onMounted } from 'vue'
import defaultOptions from './js/defaultOptions.js'
import { generateId, getComponentName } from './js/utils.js'

import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'

const containerList = import.meta.globEager('./containerItem/*.vue')
const _this = getCurrentInstance().appContext
for (const path in containerList) {
  const name = path.match(/([A-Za-z0-9_-]+)/g)[1]
  const componentName = `Ma${name[0].toUpperCase() + name.substring(1)}`
  if (! _this.components[componentName]) {
    _this.app.component(componentName, containerList[path].default)
  }
}

const formLoading = ref(false)
const form = ref({})

const props = defineProps({
  modelValue: Object,
  columns: { type: Array },
  options: { type: Object, default: () => {} },
})

const options = Object.assign(defaultOptions, props.options)

</script>