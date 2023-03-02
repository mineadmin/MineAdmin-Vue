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
      <ma-upload
        v-model="value"
        :title="props.component.title"
        :disabled="props.component.disabled"
        :icon="props.component.icon"
        :rounded="props.component.rounded"
        :multiple="props.component.multiple"
        :draggable="props.component.draggable"
        :size="props.component.size"
        :chunk="props.component.chunk"
        :chunkSize="props.component.chunkSize"
        :limit="props.component.limit"
        :tip="props.component.tip"
        :type="props.component.type"
        :accept="props.component.accept"
        :returnType="props.component.returnType"
        :fileType="props.component.fileType"
        :showList="props.component.showList"
      >
      </ma-upload>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set } from 'lodash'
import MaUpload from '@/components/ma-upload/index.vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({
  component: Object,
  customField: { type: String, default: undefined }
})

const formModel = inject('formModel')
const index = props.customField ?? props.component.dataIndex
const value = ref(get(formModel.value, index))

watch( () => get(formModel.value, index), vl => value.value = vl )
watch( () => value.value, v => set(formModel.value, index, v) )

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>