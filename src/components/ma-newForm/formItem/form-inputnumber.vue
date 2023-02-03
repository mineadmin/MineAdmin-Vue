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
      @input="props.component.input"
      @change="props.component.change"
      @clear="props.component.clear"
      @focus="props.component.focus"
      @blur="props.component.blur"
    >
      <template #suffix v-if="props.component.openSuffix">
        <slot :name="`input${upperCaseFirst(props.component.dataIndex)}Suffix`" />
      </template>
      <template #prefix v-if="props.component.openPrefix">
        <slot :name="`input${upperCaseFirst(props.component.dataIndex)}Prefix`" />
      </template>
    </a-input-number>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, getCurrentInstance } from 'vue'
import MaFormItem from './form-item.vue'
import { upperCaseFirst } from '../js/utils.js'
const formModel = inject('formModel')
const maFieldEditorRef = ref()
const props = defineProps({
  component: Object,
})
</script>