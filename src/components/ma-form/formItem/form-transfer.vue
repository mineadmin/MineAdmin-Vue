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
      <a-transfer
        v-model="value"
        :show-search="props.component.showSearch"
        :show-select-all="props.component.showSelectAll"
        :title="typeof props.component.title == 'array' ? props.component.title : ['源数据', '目标数据']"
        :disabled="props.component.disabled"
        :simple="props.component.simple"
        :data="props.component.data ?? dictList[dictIndex] ?? []"
        :fallback="props.component.fallback"
        @change="maEvent.handleChangeEvent(props.component, $event)"
        @select="maEvent.customeEvent(props.component, $event, 'onSelect')"
      >
      </a-transfer>
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
const dictList  = inject('dictList')
const index = props.customField ?? props.component.dataIndex
const dictIndex = index.match(/^(\w+\.)\d+\./) ? index.match(/^(\w+\.)\d+\./)[1] + props.component.dataIndex : props.component.dataIndex
const value = ref(get(formModel.value, index))

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => set(formModel.value, index, v) )

if (props.component.dict && (props.component.dict.name || props.component.dict.data)) { 
  value.value = value.value + ''
}

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>