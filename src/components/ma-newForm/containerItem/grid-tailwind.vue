<template>
  <div
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[ gridClass, props.component?.customClass ]"
  >
    <template v-for="(col, colIndex) in (props.component?.cols ?? [])" :key="colIndex">
      <ma-grid-tailwind-col :component="col">
        <template v-for="(component, componentIndex) in (props.component?.formList ?? [])" :key="componentIndex">
          <component
            :is="getComponentName(component?.formType ?? 'input')"
            :component="component"
          >
            <template v-for="slot in Object.keys($slots)" #[slot]="component" >
              <slot :name="slot" v-bind="component" />
            </template>
          </component>
        </template>
      </ma-grid-tailwind-col>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MaGridTailwindCol from './grid-tailwind-col.vue'
import { getComponentName } from '../js/utils.js'
const props = defineProps({ component: Object })
const gridClass = ref(`grid grid-cols-1 lg:grid-cols-${props.component.colNumber ?? 1}`)
</script>