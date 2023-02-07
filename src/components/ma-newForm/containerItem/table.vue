<template>
  <table
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="['table-container', props.component?.customClass]"
  > 
    <tbody>
      <tr v-for="(row, rowIndex) in (props.component?.rows ?? [])" :key="rowIndex">
        <template v-for="(col, colIndex) in (row.cols ?? [])" :key="colIndex">
          <ma-table-cell :component="col">
            <template v-for="(component, componentIndex) in (col.formList ?? [])" :key="componentIndex">
              <component
                :is="getComponentName(component?.formType ?? 'input')"
                :component="component"
              >
                <template v-for="slot in Object.keys($slots)" #[slot]="component">
                  <slot :name="slot" v-bind="component" />
                </template>
              </component>
            </template>
          </ma-table-cell>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import MaTableCell from './table-cell.vue'
import { getComponentName } from '../js/utils.js'
const props = defineProps({ component: Object })
</script>

<style lang="less">
table.table-container {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  .table-cell {
    border: 1px solid var(--color-neutral-3);
    padding: 0.2em;
  }
}
</style>