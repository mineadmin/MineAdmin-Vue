<template>
  <td
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="['table-cell', props.component?.customClass]"
    :colspan="props.component.colSpan"
    :rowspan="props.component.rowSpan"
  >
    <template v-for="(component, componentIndex) in (props.component?.formList ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component?.formType ?? 'input')"
        :component="component"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="options" >
          <slot :name="slot" v-bind="options" />
        </template>
      </component>
    </template>
  </td>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })
</script>