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
  <a-col
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[props.component?.customClass]"
    :span="props.component?.span ?? 12"
    :offset="props.component?.offset"
    :order="props.component?.order"
    :xs="props.component?.xs"
    :sm="props.component?.sm"
    :md="props.component?.md"
    :lg="props.component?.lg"
    :xl="props.component?.xl"
    :xxl="props.component?.xxl"
    :flex="props.component?.flex"
  >
    <template v-for="(component, componentIndex) in (props.component?.formList ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component?.formType ?? 'input')"
        :component="component"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="component">
          <slot :name="slot" v-bind="component" />
        </template>
      </component>
    </template>
  </a-col>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { getComponentName } from '../js/utils.js'
const props = defineProps({ component: Object })
</script>