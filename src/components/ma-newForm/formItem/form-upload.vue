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
  >
    <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
      <ma-upload
        v-model="formModel[props.component.dataIndex]"
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
import { ref, inject, onMounted } from 'vue'
import MaUpload from '@/components/ma-upload/index.vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const formModel = inject('formModel')
const props = defineProps({
  component: Object,
})

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>