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
  <div
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[ gridClass, props.component?.customClass ]"
    :style="props.component?.style"
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
import { ref, onMounted } from 'vue'
import MaGridTailwindCol from './grid-tailwind-col.vue'
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })
const gridClass = ref(['ma-grid', 'grid', 'lg:grid-cols-' + props.component?.colNumber ?? 1])

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>

<style scoped>
@media (min-width: 1024px) {
  .lg\:grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr))
  }
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr))
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr))
  }
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr))
  }
  .lg\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr))
  }
  .lg\:grid-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr))
  }
  .lg\:grid-cols-7 {
    grid-template-columns: repeat(7, minmax(0, 1fr))
  }
  .lg\:grid-cols-8 {
    grid-template-columns: repeat(8, minmax(0, 1fr))
  }
  .lg\:grid-cols-9 {
    grid-template-columns: repeat(9, minmax(0, 1fr))
  }
  .lg\:grid-cols-10 {
    grid-template-columns: repeat(10, minmax(0, 1fr))
  }
  .lg\:grid-cols-11 {
    grid-template-columns: repeat(11, minmax(0, 1fr))
  }
  .lg\:grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr))
  }
}
</style>