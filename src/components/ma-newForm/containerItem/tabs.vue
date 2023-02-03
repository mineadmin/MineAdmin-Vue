<template>
  <a-tabs
    :default-active-key="0"
    :trigger="props.component.trigger"
    :position="props.component.position"
    :size="props.component.size"
    :type="props.component.type"
    :direction="props.component.direction"
    :editable="props.component.editable"
    :animation="props.component.animation"
    :justify="props.component.justify"
    :show-add-button="props.component.showAddButton"
    :hide-content="props.component.hideContent"
    :lazy-load="props.component.lazyLoad"
  >
    <a-tab-pane
      v-for="(tab, index) in props.component?.options?.tabs ?? []"
      :key="index"
      :title="tab.title ?? `Tab ${index + 1}`"
    >
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
import { getComponentName } from '../js/utils.js'

const props = defineProps({ component: Object })
</script>