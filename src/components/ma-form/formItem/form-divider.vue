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
  <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
    <a-divider
      v-if="(typeof props.component.display == 'undefined' || props.component.display === true)"
      :class="[ props.component.customClass ]"
      :margin="props.component.margin"
      :direction="props.component.direction"
      :orientation="props.component.orientation"
      :type="props.component.type"
      :size="props.component.size"
    >
      {{ props.component?.title ?? '' }}
    </a-divider>
  </slot>
</template>
  
<script setup>
import { onMounted } from 'vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({
  component: Object,
})

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>