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
  <a-input-group v-if="props.component.formType === 'input-number' && (props.component?.rangeSearch ?? false)">
    <a-input-number
      v-model="minData"
      allow-clear
      :placeholder="props.component.searchPlaceholder ?? `请输入${props.component.title}最小值`"
    />
    <span class="p-1">~</span>
    <a-input-number
      v-model="maxData"
      allow-clear
      :placeholder="props.component.searchPlaceholder ?? `请输入${props.component.title}最大值`"
    />
  </a-input-group>

  <a-input-number
    v-else-if="props.component.formType === 'input-number'"
    v-model="value"
    :placeholder="props.component.searchPlaceholder ?? `请输入${props.component.title}`"
    allow-clear
  />
  <a-input
    v-else
    v-model="value"
    :placeholder="props.component.searchPlaceholder ?? `请输入${props.component.title}`"
    allow-clear
  />
</template>
  
<script setup>
import { ref, inject, watch } from 'vue'
import { get, set, isArray } from 'lodash'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const minData = ref(isArray(props.component?.searchDefaultValue) ? props.component?.searchDefaultValue[0] : undefined)
const maxData = ref(isArray(props.component?.searchDefaultValue) ? props.component?.searchDefaultValue[1] : undefined)
const value = ref(get(searchForm.value, props.component.dataIndex, props.component.searchDefaultValue ?? ''))

if (props.component.formType === 'input-number' && (props.component?.rangeSearch ?? false)) {
  set(searchForm.value, `${props.component.dataIndex}Min`, minData.value)
  set(searchForm.value, `${props.component.dataIndex}Max`, maxData.value)
  
  watch( () => get(searchForm.value, props.component.dataIndex + 'Min'), vl => minData.value = vl )
  watch( () => get(searchForm.value, props.component.dataIndex + 'Max'), vl => maxData.value = vl )
} else {
  set(searchForm.value, props.component.dataIndex, value.value)
}

watch( () => get(searchForm.value, props.component.dataIndex), vl => value.value = vl )
watch( () => value.value, v => set(searchForm.value, props.component.dataIndex, v) )
watch( () => minData.value, v => set(searchForm.value, `${props.component.dataIndex}Min`, v) )
watch( () => maxData.value, v => set(searchForm.value, `${props.component.dataIndex}Max`, v) )
</script>