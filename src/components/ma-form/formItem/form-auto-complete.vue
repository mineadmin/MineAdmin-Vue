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
      <a-auto-complete
        v-model="value"
        :disabled="props.component.disabled"
        :size="props.component.size"
        :placeholder="props.component.placeholder ?? `请输入${props.component.title}`"
        :readonly="props.component.readonly"
        :data="props.component.data ?? []"
        :strict="props.component.strict"
        :filter-option="props.component.filterOption"
        :allow-clear="props.component.allowClear ?? true"
        @change="maEvent.customeEvent(props.component, $event, 'onChange')"
        @search="maEvent.customeEvent(props.component, $event, 'onSearch')"
        @select="maEvent.customeEvent(props.component, $event, 'onSelect')"
        @clear="maEvent.customeEvent(props.component, $event, 'onClear')"
      >
        <slot :name="`autoCompleteFooter-${props.component.dataIndex}`"></slot>
      </a-auto-complete>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set } from 'lodash'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const index = props.customField ?? props.component.dataIndex
const value = ref(get(formModel.value, index, ''))

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => set(formModel.value, index, v) )

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>