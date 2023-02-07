<template>
  <ma-form-item
    v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <a-radio-group
        v-model="formModel[props.component.dataIndex]"
        :size="props.component.size"
        :direction="props.component.direction"
        :type="props.component.type"
        :disabled="props.component.disabled"
        @change="handleCascaderChangeEvent($event)"
      >
        <template v-for="(item, index) in dictList[props.component.dataIndex]">
          <a-radio :value="item.value" :disabled="item.disabled">{{ item.label }}</a-radio>
        </template>
      </a-radio-group>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, nextTick } from 'vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
import { handlerCascader } from '../js/networkRequest.js'
const formModel = inject('formModel')
const dictList  = inject('dictList')
const formLoading = inject('formLoading')
const columns = inject('columns')
const props = defineProps({
  component: Object,
})

const handleCascaderChangeEvent = (value) => {

  // 执行自定义事件
  if (props.component.onChange) {
    maEvent.handleChangeEvent(props.component, value)
  }

  // 处理联动
  formLoading.value = true
  handlerCascader(value, props.component, columns, dictList, formModel)
  nextTick(() => formLoading.value = false)

}

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>