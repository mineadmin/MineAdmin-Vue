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
  <ma-form-item
    v-show="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :component="props.component"
  >
    <template v-for="(component, componentIndex) in (props.component.formList ?? [])" :key="componentIndex">
      <component
        v-if="! containerItems.includes(component.formType)"
        :is="getComponentName(component?.formType ?? 'input')"
        :component="component"
        :showFormItem="false"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="component">
          <slot :name="slot" v-bind="component" />
        </template>
      </component>
    </template>
  </ma-form-item>
</template>

<script setup>
import { onMounted } from 'vue'
import { getComponentName, containerItems } from '../js/utils.js'
import MaFormItem from '../formitem/form-item.vue'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>