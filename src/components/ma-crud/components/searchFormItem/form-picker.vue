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
  <component
    :is="getComponentName()"
    v-model="value"
    :placeholder="props.component.formType === 'range' ? ['请选择开始时间', '请选择结束时间'] : `请选择${props.component.title}`"
    :time-picker-props="props.component.formType == 'range' ? { defaultValue: ['00:00:00', '23:59:59'] } : {}"
    :show-time="props.component.showTime"
    :type="props.component.range ? props.component.formType === 'time' ? 'time-range' : 'range' : ''"
    :format="props.component.format || ''"
    :mode="props.component.mode"
    allow-clear
    style="width: 100%;"
  />
</template>
  
<script setup>
import { ref, inject, watch } from 'vue'
import { get, set } from 'lodash'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')

const getComponentName = () => {
  if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(props.component.formType)) {
    return `a-${props.component.formType}-picker`
  }
}

let defaultValue

if (props.component.formType === 'range') {
  defaultValue = props.component.searchDefaultValue ?? []
} else {
  defaultValue = props.component.searchDefaultValue ?? ''
}

const value = ref(get(searchForm.value, props.component.dataIndex, defaultValue))
set(searchForm.value, props.component.dataIndex, value.value)

watch( () => get(searchForm.value, props.component.dataIndex), vl => value.value = vl )
watch( () => value.value, v => set(searchForm.value, props.component.dataIndex, v) )

</script>