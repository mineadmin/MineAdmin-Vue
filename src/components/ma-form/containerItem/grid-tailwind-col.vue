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
    :class="['grid-responsive-padding', props.component?.customClass]"
    :style="props.component?.style"
    :span="props.component?.span ?? 12"
  >
    <template v-for="(component, componentIndex) in (props.component?.formList ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component.formType ?? 'input')"
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
const props = defineProps({ component: Object })
</script>

<style>
.grid-responsive-padding {
  padding: 0 0.2em;
}
</style>