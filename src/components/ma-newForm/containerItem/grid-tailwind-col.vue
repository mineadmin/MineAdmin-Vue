<template>
  <div
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="['grid-responsive-padding', props.component?.customClass]"
    :span="props.component?.span ?? 12"
    :offset="props.component?.offset"
    :suffix="props.component?.suffix"
  >
    <template v-for="(component, componentIndex) in (props.component?.formList ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component.formType)"
        :component="component"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="component" >
          <slot :name="slot" v-bind="component" />
        </template>
      </component>
    </template>
  </div>
</template>

<script setup>
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })
</script>

<style>
.grid-responsive-padding {
  padding: 0 0.2em;
}
</style>