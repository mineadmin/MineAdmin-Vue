<template>
  <a-grid
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[props.component?.customClass]"
    :cols="props.component?.cols"
    :row-gap="props.component?.rowGap"
    :col-gap="props.component?.colGap"
    :collapsed="props.component?.collapsed"
    :collapsed-rows="props.component?.collapsedRows"
  >
    <template v-for="(col, colIndex) in (props.component?.items ?? [])" :key="colIndex">
      <ma-grid-responsive-col :component="col">
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
      </ma-grid-responsive-col>
    </template>
  </a-grid>
</template>

<script setup>
import MaGridResponsiveCol from './grid-responsive-col.vue'
import { getComponentName } from '../js/utils.js'
const props = defineProps({ component: Object })
</script>