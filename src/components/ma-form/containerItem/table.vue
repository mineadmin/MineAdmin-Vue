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
  <table
    v-if="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="['table-container', props.component?.customClass]"
    :style="props.component?.style"
  > 
    <tbody>
      <tr
        v-for="(row, rowIndex) in (props.component?.rows ?? [])"
        :key="rowIndex"
        :class="['table-row', row?.customClass]"
        :style="row?.style"
      >
        <template v-for="(col, colIndex) in (row.cols ?? [])" :key="colIndex">
          <ma-table-cell :component="col">
            <template v-for="slot in Object.keys($slots)" #[slot]="component">
              <slot :name="slot" v-bind="component" />
            </template>
          </ma-table-cell>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import MaTableCell from './table-cell.vue'
import { runEvent } from '../js/event.js'
const props = defineProps({ component: Object })

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)

rv('onCreated')
onMounted(() => rv('onMounted'))
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