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
    v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
    :show-form-item="props.showFormItem"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <a-cascader
        v-model="value"
        :placeholder="props.component.placeholder || `请选择${props.component.title}`"
        :allow-clear="props.component.allowClear ?? true"
        :allow-search="props.component.allowSearch ?? true"
        :size="props.component.size"
        :disabled="props.component.disabled"
        :multiple="props.component.multiple"
        :options="props.component.data ?? dictList[props.component.dataIndex] ?? []"
        :input-value="props.component.inputValue"
        :default-input-value="props.component.defaultInputValue"
        :popup-visible="props.component.popupVisible"
        :default-popup-visible="props.component.defaultPopupVisible"
        :expand-trigger="props.component.expandTrigger"
        :filter-option="props.component.filterOption"
        :popup-container="props.component.popupContainer"
        :max-tag-count="props.component.maxTagCount"
        :format-label="props.component.formatLabel"
        :trigger-props="props.component.triggerProps"
        :check-strictly="props.component.checkStrictly"
        :load-more="props.component.loadMore"
        :loading="props.component.loading"
        :search-option-only-label="props.component.searchOptionOnlyLabel"
        :search-delay="props.component.searchDelay"
        :field-names="props.component.fieldNames ?? props.component?.dict?.props ?? { key: 'value', title: 'label' }"
        :value-key="props.component.valueKey"
        :fallback="props.component.fallback"
        :expand-child="props.component.expandChild"
        @change="maEvent.handleChangeEvent(props.component, $event)"
        @input-value-change="maEvent.handleInputEvent(props.component, $event)"
        @popup-visible-change="maEvent.customeEvent(props.component, $event, 'onPopupVisibleChange')"
        @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
        @focus="maEvent.handleCommonEvent(props.component, 'onFocus')"
        @blur="maEvent.handleCommonEvent(props.component, 'onBlur')"
        @search="maEvent.customeEvent(props.component, $event, 'onSearch')"
      >
      </a-cascader>
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
  showFormItem: { type: Boolean, default: true }
})

const formModel = inject('formModel')
const dictList  = inject('dictList')
const value = ref(get(formModel, props.component.dataIndex))

watch(
  () => value.value, v => set(formModel, props.component.dataIndex, v)
)

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>