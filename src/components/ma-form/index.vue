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
  <div class="w-full">
    <a-spin :loading="formLoading" :tip="options.loadingText" class="w-full">
      <div
        v-if="options.showFormTitle"
        :class="['ma-form-title', options.formTitleClass]"
        :style="options.formTitleStyle"
      >
        {{ options.formTitle }}
      </div>
      <a-form
        ref="maFormRef"
        :model="form"
        :class="['ma-form', options?.customClass]"
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
            <template v-for="slot in Object.keys($slots)" #[slot]="component">
              <slot :name="slot" v-bind="component" />
            </template>
          </component>
        </template>
        <div class="text-center" v-if="options.showButtons">
          <a-space>
            <slot name="formBeforeButtons" />
            <slot name="formButtons">
              <a-button :type="options.submitType" :status="options.submitStatus" v-if="options.submitShowBtn" html-type="submit">
                <template #icon v-if="options?.submitIcon">
                  <component :is="options.submitIcon" />
                </template>
                {{ options.submitText }}
              </a-button>
              <a-button :type="options.resetType" :status="options.resetStatus" v-if="options.resetShowBtn" @click="resetForm">
                <template #icon v-if="options?.resetIcon">
                  <component :is="options.resetIcon" />
                </template>
                {{ options.resetText }}
              </a-button>
            </slot>
            <slot name="formAfterButtons" />
          </a-space>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup>
import {
  ref, watch, provide,
  onMounted, nextTick, getCurrentInstance
} from 'vue'
import { isNil, get } from 'lodash'
import defaultOptions from './js/defaultOptions.js'
import {
  getComponentName, toHump,
  interactiveControl, handleFlatteningColumns
} from './js/utils.js'
import { loadDict, handlerCascader } from './js/networkRequest.js'
import arrayComponentDefault from './js/defaultArrayComponent.js'

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
const form = ref({})

const props = defineProps({
  modelValue: { type: Object, default: {} },
  columns: { type: Array },
  options: { type: Object, default: {} },
})
const emit = defineEmits(['onSubmit', 'update:modelValue'])

watch(
  () => props.modelValue,
  vl => form.value = vl,
  { immediate: true, deep: true }
)

watch(
  () => form.value,
  vl => {
    interactiveControl(vl, flatteningColumns.value)
    emit('update:modelValue', vl)
  },
  { deep: true }
)


const options = ref(Object.assign(JSON.parse(JSON.stringify(defaultOptions)), props.options))

// 初始化
const init = async () => {

  formLoading.value = true
  
  handleFlatteningColumns(props.columns, flatteningColumns.value)

  // 收集数据列表
  flatteningColumns.value.map(item  => {
    if (item.cascaderItem && item.cascaderItem.length > 0) {
      cascaderList.value.push(...item.cascaderItem)
    }
  })

  // 初始化数据
  flatteningColumns.value.map(async item => {

    if ( isNil(form.value[item.dataIndex]) && ! item.isChildrenForm ) {
      form.value[item.dataIndex] = undefined
      if (arrayComponentDefault.includes(item.formType) && ! item.isChildrenForm) {
        form.value[item.dataIndex] = []
      }
    }

    // 字典
    if (! cascaderList.value.includes(item.dataIndex) && item.dict) {
      await loadDict(dictList.value, item)
    }

    // 联动
    await handlerCascader(
      get(form.value, item.dataIndex),
      item,
      flatteningColumns.value,
      dictList.value,
      form.value,
      false
    )
  })

  await nextTick(() => {
    interactiveControl(form.value, flatteningColumns.value)
    formLoading.value = false
  })
}

provide('options', options.value)
provide('columns', flatteningColumns)
provide('dictList', dictList)
provide('formModel', form)
provide('formLoading', formLoading)
maEvent.handleCommonEvent(options.value, 'onCreated')

onMounted(async () => {
  maEvent.handleCommonEvent(options.value, 'onMounted')
  options.value.init && await init()
  maEvent.handleCommonEvent(options.value, 'onInit')
})

const done = (status) => formLoading.value = status
const validateForm = async () => {
  const valid = await maFormRef.value.validate()
  if ( valid ) {
    let message = ''
    for (let name in valid) message += valid[name].message + "、"
    Message.error(message.substring(0, message.length - 1))
  }
  return valid
}
const resetForm = async() => await maFormRef.value.resetFields()
const clearValidate = async() => await maFormRef.value.clearValidate()

const formSubmit = async () =>  (await validateForm() && !formLoading.value ) || emit('onSubmit', form.value, done)

const getFormRef = () => maFormRef.value
const getDictList = () => dictList.value
const getDictService = () => {
  const DictService = function (dictList) {
    /**
     * dict项服务类
     * @param dataIndex
     * @param dictData
     * @constructor
     */
    const DictItemService = function (dataIndex, dictData) {
      this.dict = dictData
      this.dataIndex = dataIndex

      /**
       * 返回原DictData对象
       * @returns {*}
       */
      this.getRawDictData = () => {
        return this.dict
      }
      /**
       * 追加
       * @param label
       * @param value
       * @param extend
       */
      this.append = (label, value, extend = {}) => {
        this.getRawDictData().push(Object.assign({
          label: label,
          value: value,
        }, extend))
      }
      /**
       * 重新加载dict
       * @param dictConfig
       * @returns {Promise<void>}
       */
      this.loadDict = (dictConfig) => {
        return loadDict(dictList, {formType: "select", dict: dictConfig, dataIndex: this.dataIndex})
      }
    }

    this.dictMap = new Map()
    for (const [dataIndex, dictData] of Object.entries(dictList)) {
      this.dictMap.set(dataIndex, new DictItemService(dataIndex, dictData))
    }
    this.get = (key) => {
      return this.dictMap.get(key)
    }
  }
  return new DictService(getDictList())
}
const getColumns = () => flatteningColumns.value
const getCascaderList = () => cascaderList.value
const getFormData = () => form.value

defineExpose({
  init, getFormRef, getColumns, getDictList, getDictService, getCascaderList, getFormData,
  validateForm, resetForm, clearValidate
})
</script>

<style lang="less" scoped>
.ma-form-title {
  font-size: 18px; text-align: center;
}
</style>