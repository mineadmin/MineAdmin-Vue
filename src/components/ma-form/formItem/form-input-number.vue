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
      <a-input-number
        v-model="value"
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
        @input="rv('onInput', $event)"
        @change="rv('onChange', $event)"
        @clear="rv('onClear')"
        @focus="rv('onFocus')"
        @blur="rv('onBlur')"
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
      </a-input-number>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set, toNumber, isNaN } from 'lodash'
import MaFormItem from './form-item.vue'
import { runEvent } from '../js/event.js'
const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const index = props.customField ?? props.component.dataIndex
const value = ref(toNumber(get(formModel.value, index)))

const rv = async (ev, value = undefined) => {
  if(ev === 'onChange') set(formModel.value, index, value)
  await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)
}

watch( () => get(formModel.value, index), vl => value.value = toNumber(vl))
watch( () => value.value, v => {
  if (isNaN(v)) v = undefined
  set(formModel.value, index, v)
  index.indexOf('.') > -1 && delete formModel.value[index]
} )

rv('onCreated')
onMounted(() => rv('onMounted'))
</script>
