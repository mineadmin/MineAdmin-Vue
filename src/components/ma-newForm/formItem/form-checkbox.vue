<template>
  <ma-form-item
    v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
    :component="props.component"
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <a-checkbox-group
        v-model="formModel[props.component.dataIndex]"
        :size="props.component.size"
        :max="props.component.max"
        :direction="props.component.direction"
        :disabled="props.component.disabled"
        @change="maEvent.handleChangeEvent(props.component, $event)"
      >
        <template v-for="(item, index) in dictList[props.component.dataIndex]">
          <a-checkbox :value="item.value" :disabled="item.disabled" :indeterminate="item.indeterminate">{{ item.label }}</a-checkbox>
        </template>
      </a-checkbox-group>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const formModel = inject('formModel')
const dictList  = inject('dictList')
const props = defineProps({
  component: Object,
})

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>