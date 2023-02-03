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
      @input="maEvent.handleInputEvent(props.component, $event)"
      @change="maEvent.handleChangeEvent(props.component, $event)"
      @press-enter="maEvent.handleCommonEvent(props.component, 'onPressEnter')"
      @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
      @focus="maEvent.handleCommonEvent(props.component, 'onFocus')"
      @blur="maEvent.handleCommonEvent(props.component, 'onBlur')"
      @search="maEvent.handleInputSearchEvent(props.component, $event)"
    >
      <template #prepend v-if="props.component.openPrepend">
        <slot :name="`input-${props.component.dataIndex}-prepend`" />
      </template>
      <template #append v-if="props.component.openApppend">
        <slot :name="`input-${props.component.dataIndex}-append`" />
      </template>
      <template #suffix v-if="props.component.openSuffix">
        <slot :name="`input-${props.component.dataIndex}-suffix`" />
      </template>
      <template #prefix v-if="props.component.openPrefix">
        <slot :name="`input-${props.component.dataIndex}-prefix`" />
      </template>
    </component>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
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
}

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>