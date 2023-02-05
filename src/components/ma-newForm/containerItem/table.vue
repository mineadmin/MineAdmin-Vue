<template>
  <a-row
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[props.component?.customClass]"
    :extra="props.component?.extra"
    :bordered="props.component?.bordered"
    :loading="props.component?.loading"
    :hoverable="props.component?.hoverable"
    :size="props.component?.size"
    :header-style="props.component?.headerStyle"
    :body-style="props.component?.bodyStyle"
  >
    <template v-for="(col, colIndex) in (props.component?.cols ?? [])" :key="colIndex">
      <ma-grid-col :component="col">
        <template v-for="(component, componentIndex) in (props.component?.childrenForm ?? [])" :key="componentIndex">
          <component
            :is="getComponentName(component.formType)"
            :component="component"
          >
            <template v-for="slot in Object.keys($slots)" #[slot]="component" >
              <slot :name="slot" v-bind="component" />
            </template>
          </component>
        </template>
      </ma-grid-col>
    </template>
  </a-row>
</template>

<script setup>
import MaGridCol from './grid-col.vue'
import { getComponentName } from '../js/utils.js'
const props = defineProps({ component: Object })
</script>