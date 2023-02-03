<template>
  <ma-form-item
    v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
  >
    <a-input-number
      ref="maFieldEditorRef"
      v-model="formModel[props.component.dataIndex]"
      :size="props.component.size"
      :allow-clear="props.component.allowClear ?? true"
      :disabled="props.component.disabled"
      :read-only="props.component.readonly"
      :error="props.component.error"
      :placeholder="props.component.placeholder ?? `请输入${props.component.title}`"
      :mode="props.component.mode"
      :precision="props.component.precision"
      :step="props.component.step"
      :max="props.component.max"
      :min="props.component.min"
      :formatter="props.component.formatter"
      :parser="props.component.parser"
      :model-event="props.component.modelEvent"
      @input="maEvent.handleInputEvent(props.component, $event)"
      @change="maEvent.handleChangeEvent(props.component, $event)"
      @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
      @focus="maEvent.handleCommonEvent(props.component, 'onFocus')"
      @blur="maEvent.handleCommonEvent(props.component, 'onBlur')"
    >
      <template #suffix v-if="props.component.openSuffix">
        <slot :name="`input-${props.component.dataIndex}-suffix`" />
      </template>
      <template #prefix v-if="props.component.openPrefix">
        <slot :name="`input-${props.component.dataIndex}-prefix`" />
      </template>
    </a-input-number>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const formModel = inject('formModel')
const maFieldEditorRef = ref()
const props = defineProps({ component: Object })

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>