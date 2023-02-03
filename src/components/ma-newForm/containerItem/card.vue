<template>
  <a-card
  >
    <template v-for="(component, componentIndex) in (props.component?.options?.childrenForm ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component.formType)"
        :component="component"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="options" >
          <slot :name="slot" v-bind="options" />
        </template>
      </component>
    </template>
  </a-card>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { getComponentName } from '../js/utils.js'

const props = defineProps({ component: Object })
</script>