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
      <a-mention
        v-model="formModel[props.component.dataIndex]"
        :size="props.component.size"
        :allow-clear="props.component.allowClear ?? true"
        :disabled="props.component.disabled"
        :readonly="props.component.readonly"
        :data="props.component.data ?? []"
        :prefix="props.component.prefix"
        :split="props.component.split"
        :error="props.component.error"
        :placeholder="props.component.placeholder ?? `请输入${props.component.title}`"
        :type="props.component.type"
        @input="maEvent.handleInputEvent(props.component, $event)"
        @clear="maEvent.handleCommonEvent(props.component, 'onClear')"
        @focus="maEvent.handleCommonEvent(props.component, 'onFocus')"
        @blur="maEvent.handleCommonEvent(props.component, 'onBlur')"
        @search="maEvent.customeEvent(props.component, $event, 'onSearch')"
        @select="maEvent.customeEvent(props.component, $event, 'onSelect')"
      >
      </a-mention>
    </slot>
  </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
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