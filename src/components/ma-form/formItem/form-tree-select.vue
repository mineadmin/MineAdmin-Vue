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
      <a-tree-select
        v-model="value"
        :data="props.component.data ?? dictList[dictIndex] ?? []"
        :disabled="props.component.disabled"
        :readonly="props.component.readonly"
        :loading="props.component.loading"
        :error="props.component.error"
        :size="props.component.size"
        :border="props.component.border"
        :allow-search="props.component.allowSearch ?? true"
        :allow-clear="props.component.allowClear ?? true"
        :placeholder="props.component.placeholder ?? `请选择${props.component.title}`"
        :max-tag-count="props.component.maxTagCount"
        :multiple="props.component.multiple"
        :field-names="props.component.fieldNames ?? props.component?.dict?.props ?? { key: 'value', title: 'label' }"
        :label-in-value="props.component.labelInValue"
        :tree-checkable="props.component.treeCheckable"
        :tree-check-strictly="props.component.treeCheckStrictly"
        :tree-checked-strategy="props.component.treeCheckedStrategy"
        :tree-props="props.component.treeProps"
        :trigger-props="props.component.triggerProps"
        :popup-visible="props.component.popupVisible"
        :default-popup-visible="props.component.defaultPopupVisible"
        :dropdown-style="props.component.dropdownStyle"
        :dropdown-class-name="props.component.dropdownClassName"
        :filter-tree-node="props.component.filterTreeNode"
        :load-more="props.component.loadMore"
        :disable-filter="props.component.disableFilter"
        :popup-container="props.component.popupContainer"
        :fallback-option="props.component.fallbackOption"
        :selectable="props.component.selectable"
        :scrollbar="props.component.scrollbar"
        @change="maEvent.handleChangeEvent(props.component, $event)"
        @popup-visible-change="maEvent.customeEvent(props.component, $event, 'onPopupVisibleChange')"
        @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
        @search="maEvent.customeEvent(props.component, $event, 'onSearch')"
      >
      </a-tree-select>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set } from 'lodash'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
import { handlerCascader } from '../js/networkRequest.js'

const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const dictList  = inject('dictList')
const index = props.customField ?? props.component.dataIndex
const dictIndex = index.match(/^(\w+\.)\d+\./) ? index.match(/^(\w+\.)\d+\./)[1] + props.component.dataIndex : props.component.dataIndex
const value = ref(get(formModel.value, index))

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => set(formModel.value, index, v) )

if (props.component.dict && (props.component.dict.name || props.component.dict.data) && !props.component.multiple) { 
  value.value = value.value + ''
}

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>