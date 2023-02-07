<template>
  <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
    <a-divider
      v-show="(typeof props.component.display == 'undefined' || props.component.display === true)"
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