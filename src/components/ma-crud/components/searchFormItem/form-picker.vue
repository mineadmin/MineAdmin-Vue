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
    v-model="searchForm[props.component.dataIndex]"
    :placeholder="props.component.formType === 'range' ? ['请选择开始时间', '请选择结束时间'] : `请选择${props.component.title}`"
    :time-picker-props="props.component.formType == 'range' ? { defaultValue: ['00:00:00', '23:59:59'] } : {}"
    :show-time="props.component.showTime"
    :format="props.component.format || ''"
    :mode="props.component.mode"
    allow-clear
    style="width: 100%;"
  />
</template>
  
<script setup>
import { ref, inject } from 'vue'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const dicts = inject('dicts')

const getComponentName = () => {
  if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(props.component.formType)) {
    return `a-${props.component.formType}-picker`
  }
}
</script>