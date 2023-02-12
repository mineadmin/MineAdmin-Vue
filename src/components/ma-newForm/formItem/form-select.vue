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
      <a-select
        v-model:model-value="value"
        :multiple="props.component.multiple"
        :size="props.component.size"
        :allow-clear="props.component.allowClear ?? true"
        :disabled="props.component.disabled"
        :readonly="props.component.readonly"
        :error="props.component.error"
        :placeholder="props.component.placeholder ?? `请选择${props.component.title}`"
        :loading="props.component.loading"
        :allow-search="props.component.allowSearch ?? true"
        :allow-create="props.component.allowCreate"
        :max-tag-count="props.component.maxTagCount"
        :bordered="props.component.bordered"
        :unmount-on-close="props.component.unmountOnClose"
        :popup-container="props.component.popupContainer"
        :filter-option="props.component.filterOption"
        :virtual-list-props="props.component.virtualListProps"
        :trigger-props="props.component.triggerProps"
        :format-label="props.component.formatLabel"
        :fallback-option="props.component.fallbackOption"
        :show-extra-options="props.component.showExtraOptions"
        :value-key="props.component.valueKey"
        :search-delay="props.component.searchDelay"
        :limit="props.component.limit"
        :field-names="props.component.fieldNames"
        :scrollbar="props.component.scrollbar"
        @input-value-change="maEvent.handleInputEvent(props.component, $event)"
        @change="handleCascaderChangeEvent($event)"
        @remove="maEvent.customeEvent(props.component, $event, 'onRemove')"
        @popup-visible-change="maEvent.customeEvent(props.component, $event, 'onPopupVisibleChange')"
        @dropdown-scroll="maEvent.handleCommonEvent(props.component, 'onDropdownScroll')"
        @dropdown-reach-bottom="maEvent.handleCommonEvent(props.component, 'onDropdownReachBottom')"
        @exceed-limit="maEvent.customeEvent(props.component, $event, 'onExceedLimit')"
        @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
        @focus="maEvent.handleCommonEvent(props.component, 'onFocus')"
        @blur="maEvent.handleCommonEvent(props.component, 'onBlur')"
        @search="maEvent.customeEvent(props.component, $event, 'onSearch')"
      >
        <template v-for="(item, index) in dictList[props.component.dataIndex]">
          <a-option :value="item.value" :disabled="item.disabled">{{ item.label }}</a-option>
        </template>
      </a-select>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, nextTick, watch } from 'vue'
import MaFormItem from './form-item.vue'
import { get, set } from 'lodash'
import { maEvent } from '../js/formItemMixin.js'
import { handlerCascader } from '../js/networkRequest.js'

const props = defineProps({
  component: Object,
  showFormItem: { type: Boolean, default: true }
})

const formModel = inject('formModel')
const dictList  = inject('dictList')
const formLoading = inject('formLoading')
const columns = inject('columns')
const temp = inject('childrenFormList', [])
const childrenFormList = temp ? JSON.parse(JSON.stringify(temp)) : []

if (props.component.dataIndex.match(/^\w+\.\d+\./)) {
  const prefix = props.component.dataIndex.match(/^\w+\.\d+\./)[0]
  childrenFormList.map(item => {
    item.dataIndex = prefix + item.dataIndex
  })
}

const value = ref(get(formModel, props.component.dataIndex))

watch(
  () => value.value, v => {
    set(formModel, props.component.dataIndex, v)
  }
)

const handleCascaderChangeEvent = (value) => {
  const component = props.component
  // 执行自定义事件
  if (component.onChange) {
    maEvent.handleChangeEvent(component, value)
  }

  // 处理联动
  formLoading.value = true
  if (component.dataIndex.match(/^\w+\.\d+\./)) {
    handlerCascader(value, component, childrenFormList, dictList, formModel)
  } else {
    handlerCascader(value, component, columns, dictList, formModel)
  }
  nextTick(() => formLoading.value = false)

}

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>