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
  <a-tabs
    v-if="(typeof props.component?.display == 'undefined' || props.component?.display === true)"
    :class="[props.component?.customClass]"
    :trigger="props.component?.trigger"
    :position="props.component?.position"
    :size="props.component?.size"
    :type="props.component?.type"
    :direction="props.component?.direction"
    :editable="props.component?.editable"
    :animation="props.component?.animation"
    :justify="props.component?.justify"
    :show-add-button="props.component?.showAddButton"
    :hide-content="props.component?.hideContent"
    :lazy-load="props.component?.lazyLoad"
    :destroy-on-hide="props.component?.destroyOnHide"
    @change="rv('onChange', $event)"
    @tab-click="rv('onTabClick', $event)"
    @add="tabAddEvent(props.component, { formModel, getColumnService, columns })"
    @delete="tabDeleteEvent(props.component, $event, { formModel, getColumnService, columns })"
  >
    <template #extra>
      <slot :name="`tabExtra-${props.component?.dataIndex ?? ''}`"></slot>
    </template>
    <a-tab-pane
      v-for="(tab, index) in props.component?.tabs ?? []"
      :key="tab.key ?? index"
      :disabled="tab?.disabled"
      :closable="tab?.closable"
    >
      <template #title>
        <slot :name="`tabPanelTitle-${props.component?.dataIndex ?? ''}-${tab.key ?? index}`">
          {{ tab.title ?? `Tab ${index + 1}` }}
        </slot>
      </template>
      <template v-for="(component, componentIndex) in (tab.formList ?? [])" :key="componentIndex">
        <component
          :is="getComponentName(component?.formType ?? 'input')"
          :component="component"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="component">
            <slot :name="slot" v-bind="component" />
          </template>
        </component>
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import { getComponentName } from '../js/utils.js'
import { runEvent, tabAddEvent, tabDeleteEvent } from '../js/event.js'
const props = defineProps({ component: Object })

const formModel = inject('formModel')
const getColumnService= inject('getColumnService')
const columns = inject('columns')
const rv = async (ev, value = undefined) => await runEvent(props.component, ev, { formModel, getColumnService, columns }, value)

rv('onCreated')
onMounted(() => rv('onMounted'))
</script>