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
  <a-card
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
    <template #title>
      <slot :name="`cardTitle-${props.component?.dataIndex ?? ''}`">{{ props.component?.title }}</slot>
    </template>
    <template #actions>
      <slot :name="`cardAction-${props.component?.dataIndex ?? ''}`"></slot>
    </template>
    <template #cover>
      <slot :name="`cardCover-${props.component?.dataIndex ?? ''}`"></slot>
    </template>
    <template #extra>
      <slot :name="`cardExtra-${props.component?.dataIndex ?? ''}`"></slot>
    </template>
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
  </a-card>
</template>

<script setup>
import { onMounted } from 'vue'
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const props = defineProps({ component: Object })

maEvent.handleCommonEvent(props.component, 'onCreated')
onMounted(() => {
  maEvent.handleCommonEvent(props.component, 'onMounted')
})
</script>