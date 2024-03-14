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
  <ma-form-item
    v-if="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
    :custom-field="props.customField"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <component :is="getComponentName()"
        v-model="value"
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
        @input="rv('onInput', $event)"
        @change="rv('onChange', $event)"
        @press-enter="rv('onPressEnter')"
        @clear="rv('onClear')"
        @focus="rv('onFocus')"
        @blur="rv('onBlur')"
        @search="rv('onSearch', $event)"
      >

        <template #prepend v-if="props.component.openPrepend">
          <slot :name="`inputPrepend-${props.component.dataIndex}`" />
        </template>
        <template #append v-if="props.component.openAppend">
          <slot :name="`inputAppend-${props.component.dataIndex}`" />
        </template>
        <template #suffix v-if="props.component.openSuffix">
          <slot :name="`inputSuffix-${props.component.dataIndex}`" />
        </template>
        <template #prefix v-if="props.component.openPrefix">
          <slot :name="`inputPrefix-${props.component.dataIndex}`" />
        </template>
      </component>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set } from 'lodash'
import MaFormItem from './form-item.vue'
import { runEvent } from '../js/event.js'
const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)
const index = props.customField ?? props.component.dataIndex
//后端传入数字类型导致报错 Invalid prop: type check failed for prop "modelValue". Expected String with value "0", got Number with value 0
const toVal = ref(`${get(formModel.value, index)}`);
const value = ref()
if (toVal.value != 'undefined'){
  value.value = toVal.value
}

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => {
  set(formModel.value, index, v)
  index.indexOf('.') > -1 && delete formModel.value[index]
} )

const getComponentName = () => {
  if (props.component.formType === 'input') {
    return 'a-input'
  } else if (props.component.formType === 'input-password') {
    return 'a-input-password'
  } else if (props.component.formType === 'input-search') {
    return 'a-input-search'
  } else {
    return 'a-input'
  }
}

rv('onCreated')
onMounted(() => rv('onMounted'))
</script>
