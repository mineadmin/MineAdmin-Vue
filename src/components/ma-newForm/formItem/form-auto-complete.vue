<template>
  <ma-form-item
    v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <a-auto-complete
        v-model="formModel[props.component.dataIndex]"
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
import { ref, inject, onMounted, nextTick } from 'vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
import { handlerCascader } from '../js/networkRequest.js'
const formModel = inject('formModel')
const dictList  = inject('dictList')
const formLoading = inject('formLoading')
const columns = inject('columns')
const props = defineProps({
  component: Object,
})

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>