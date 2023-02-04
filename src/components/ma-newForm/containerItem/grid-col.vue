<template>
  <a-card
    ref="maContainerRef"
    v-show="(typeof props.component?.options.display == 'undefined' || props.component?.options.display === true)"
    :extra="props.component?.options?.extra"
    :bordered="props.component?.options?.bordered"
    :loading="props.component?.options?.loading"
    :hoverable="props.component?.options?.hoverable"
    :size="props.component?.options?.size"
    :header-style="props.component?.options?.headerStyle"
    :body-style="props.component?.options?.bodyStyle"
  >
    <template #title>
      <slot :name="`cardTitle-${props.component?.dataIndex ?? ''}`">{{ props.component?.options?.title }}</slot>
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
    <template v-for="(component, componentIndex) in (props.component?.options?.childrenForm ?? [])" :key="componentIndex">
      <component
        :is="getComponentName(component.formType)"
        :component="component"
      >
        <template v-for="slot in Object.keys($slots)" #[slot]="options" >
          <slot :name="slot" v-bind="options" />
        </template>
      </component>
    </template>
  </a-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { getComponentName } from '../js/utils.js'
import { maEvent } from '../js/formItemMixin.js'
const maContainerRef = ref()
const props = defineProps({ component: Object })
</script>