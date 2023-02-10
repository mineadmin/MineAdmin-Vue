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
      <ma-editor
        v-model="value"
        style="width: 100%;"
        :height="props.component.height"
        :id="props.component.id"
        @change="maEvent.handleChangeEvent(props.component, $event)"
      >
      </ma-editor>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { get, set } from 'lodash'
import MaEditor from '@/components/ma-editor/index.vue'
import MaFormItem from './form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({
  component: Object,
  showFormItem: { type: Boolean, default: true }
})

const formModel = inject('formModel')
const value = ref(get(formModel, props.component.dataIndex))

watch(
  () => value.value, v => set(formModel, props.component.dataIndex, v)
)

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>