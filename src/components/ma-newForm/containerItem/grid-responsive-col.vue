<template>
  <a-grid-item
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[props.component?.customClass]"
    :span="props.component?.span ?? 12"
    :offset="props.component?.offset"
    :suffix="props.component?.suffix"
  >
    <template v-for="(component, componentIndex) in (props.component?.childrenForm ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component.formType)"
        :component="component"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="options" >
          <slot :name="slot" v-bind="options" />
        </template>
      </component>
    </template>
  </a-grid-item>
</template>

<script setup>
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })
</script>