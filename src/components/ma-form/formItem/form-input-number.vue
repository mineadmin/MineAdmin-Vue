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
        @input="maEvent.handleInputEvent(props.component, $event)"
        @change="maEvent.handleChangeEvent(props.component, $event)"
        @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
        @focus="maEvent.handleCommonEvent(props.component, 'onFocus')"
        @blur="maEvent.handleCommonEvent(props.component, 'onBlur')"
      >
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
import { get, set, toNumber } from 'lodash'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const index = props.customField ?? props.component.dataIndex
const value = ref(toNumber(get(formModel.value, index)))

watch( () => get(formModel.value, index), vl => value.value = toNumber(vl) )
watch( () => value.value, v => set(formModel.value, index, v) )

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>