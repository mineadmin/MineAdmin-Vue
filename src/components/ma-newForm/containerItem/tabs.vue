<template>
  <a-tabs
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
  >
    <a-tab-pane
      v-for="(tab, index) in props.component?.options?.tabs ?? []"
      :key="tab.key ?? index"
    >
      <template #title>
        <slot :name="`tabPanel-${props.component?.dataIndex ?? ''}-${tab.key ?? index}-title`">{{ tab.title ?? `Tab ${index + 1}` }}</slot>
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
import { getCurrentInstance } from 'vue'
import { upperCaseFirst } from '../js/utils.js'
import { getComponentName } from '../js/utils.js'

const props = defineProps({ component: Object })
</script>