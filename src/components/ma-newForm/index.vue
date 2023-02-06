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
import { getComponentName, toHump, containerItems } from './js/utils.js'
import { arrayComponentDefault, loadDict } from './js/dict.js'

import { maEvent } from './js/formItemMixin.js'
import { Message } from '@arco-design/web-vue'

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
const flatteningColumns = ref([])
const dictList = ref({})
const cascaderList = ref([])
const childrenFormColums = ref({})
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

const handleFlatteningColumns = (data) => {
  for (let key in data) {
    const item = data[key]
    if ( containerItems.includes(item.formType) ) {
      switch ( item.formType ) {
        case 'tabs': 
          if ( item.tabs ) {
            item.tabs.map(tab => {
              tab.formList && handleFlatteningColumns(tab.formList)
            })
          }
          break
        case 'card':
          item.formList && handleFlatteningColumns(item.formList)
          break
      }
    } else if ( item.formType == 'children-form' && item.childrenForm ) {
      if (item.dataIndex) {
        childrenFormColums.value[item.dataIndex] = item.childrenForm
      } else {
        Message.error('子表单未设置 dataIndex 属性')
      }
    } else {
      flatteningColumns.value.push(item)
    }
  }
}

handleFlatteningColumns(props.columns)

const options = ref(Object.assign(defaultOptions, props.options))

// 初始化
const init = async () => {

  // 收集数据列表
  flatteningColumns.value.map(item  => {
    if (item.cascaderItem && item.cascaderItem.length > 0) {
      cascaderList.value.push(item.cascaderItem)
    }
  })

  // 初始化数据
  flatteningColumns.value.map(async item => {
    
    if (! form.value[item.dataIndex] && typeof form.value[item.dataIndex] == 'undefined') {
      form.value[item.dataIndex] = undefined
      if (arrayComponentDefault.includes(item.formType)) {
        form.value[item.dataIndex] = []
      }
    }

    if (! cascaderList.value.includes(item.dataIndex) && item.dict) {
      await loadDict(dictList.value, item)
    }
  })

}

provide('options', options.value)
provide('columns', flatteningColumns.value)
provide('dictList', dictList.value)
provide('formModel', form.value)
maEvent.handleCommonEvent(options.value, 'onCreated')

onMounted(() => {
  maEvent.handleCommonEvent(options.value, 'onMounted')
  options.value.init && init()
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