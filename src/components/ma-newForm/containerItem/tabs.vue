<template>
  <a-tabs
    ref="maContainerRef"
    v-show="(typeof props.component?.options.display == 'undefined' || props.component?.options.display === true)"
    :class="[props.component?.options.customClass]"
    :default-active-key="props.component?.options?.tabs[0]?.key ?? 0"
    :trigger="props.component?.options?.trigger"
    :position="props.component?.options?.position"
    :size="props.component?.options?.size"
    :type="props.component?.options?.type"
    :direction="props.component?.options?.direction"
    :editable="props.component?.options?.editable"
    :animation="props.component?.options?.animation"
    :justify="props.component?.options?.justify"
    :show-add-button="props.component?.options?.showAddButton"
    :hide-content="props.component?.options?.hideContent"
    :lazy-load="props.component?.options?.lazyLoad"
    :destroy-on-hide="props.component?.options?.destroyOnHide"
    @change="maEvent.handleChangeEvent(props.component, $event)"
    @tab-click="maEvent.handleTabClickEvent(props.component, $event)"
    @add="maEvent.handleTabAddEvent(props.component)"
    @delete="maEvent.handleTabDeleteEvent(props.component, $event)"
  >
    <template #extra>
      <slot :name="`tabExtra-${props.component?.dataIndex ?? ''}`"></slot>
    </template>
    <a-tab-pane
      v-for="(tab, index) in props.component?.options?.tabs ?? []"
      :key="tab.key ?? index"
      :disabled="tab?.disabled"
      :closable="tab?.closable"
    >
      <template #title>
        <slot :name="`tabPanelTitle-${props.component?.dataIndex ?? ''}-${tab.key ?? index}`">
          {{ tab.title ?? `Tab ${index + 1}` }}
        </slot>
      </template>
      <template v-for="(component, componentIndex) in (tab.childrenForm ?? [])" :key="componentIndex">
        <component
          :is="getComponentName(component.formType)"
          :component="component"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="options" >
            <slot :name="slot" v-bind="options" />
          </template>
        </component>
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const maContainerRef = ref()
const props = defineProps({ component: Object })
</script>