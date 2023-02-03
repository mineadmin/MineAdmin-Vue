<template>
  <ma-form-item
    v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
  >
    <component :is="getComponentName()"
      ref="maFieldEditorRef"
      v-model="formModel[props.component.dataIndex]"
      :size="props.component.size"
      :allow-clear="props.component.allowClear ?? true"
      :disabled="props.component.disabled"
      :readonly="props.component.readonly"
      :read-only="props.component.readonly"
      :error="props.component.error"
      :placeholder="props.component.placeholder ?? `请输入${props.component.title}`"
      :max-length="props.component.maxLength"
      :show-word-limit="props.component.showWordLimit"
      :word-length="props.component.wordLength"
      :word-slice="props.component.wordSlice"
      :invisible-button="props.component.invisibleButton"
      :search-button="props.component.searchButton"
      :loading="props.component.invisibleButton"
      :button-text="props.component.buttonText"
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
      @press-enter="props.component.pressEnter"
      @clear="props.component.clear"
      @focus="props.component.focus"
      @blur="props.component.blur"
      @search="props.component.search"
    >
      <template #prepend v-if="props.component.openPrepend">
        <slot :name="`input${upperCaseFirst(props.component.dataIndex)}Prepend`" />
      </template>
      <template #append v-if="props.component.openApppend">
        <slot :name="`input${upperCaseFirst(props.component.dataIndex)}Append`" />
      </template>
      <template #suffix v-if="props.component.openSuffix">
        <slot :name="`input${upperCaseFirst(props.component.dataIndex)}Suffix`" />
      </template>
      <template #prefix v-if="props.component.openPrefix">
        <slot :name="`input${upperCaseFirst(props.component.dataIndex)}Prefix`" />
      </template>
    </component>
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

const getComponentName = () => {
  if (props.component.formType == 'input') {
    return 'a-input'
  }
  if (props.component.formType == 'input-password') {
    return 'a-input-password'
  }
  if (props.component.formType == 'input-search') {
    return 'a-input-search'
  }
  if (props.component.formType == 'input-number') {
    return 'a-input-number'
  }
}
</script>