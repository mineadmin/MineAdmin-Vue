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
      <a-transfer
        v-model="formModel[props.component.dataIndex]"
        :show-search="props.component.showSearch"
        :show-select-all="props.component.showSelectAll"
        :title="props.component.title ?? ['源数据', '目标数据']"
        :disabled="props.component.disabled"
        :simple="props.component.simple"
        :data="props.component.data ?? dictList[props.component.dataIndex] ?? []"
        :fallback="props.component.fallback"
        @change="maEvent.handleChangeEvent(props.component, $event)"
        @select="maEvent.customeEvent(props.component, $event, 'onSelect')"
      >
      </a-transfer>
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