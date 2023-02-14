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
  <a-select
    v-model="searchForm[props.component.dataIndex]"
    :virtual-list-props="props.component.virtualListProps"
    :placeholder="props.component.searchPlaceholder ?? `请选择${props.component.title}`"
    allow-clear
    allow-search
    :scrollbar="props.component.scrollbar"
    :format-label="props.component.formatLabel"
    :max-tag-count="1"
    :options="dicts[props.component.dataIndex]"
    :multiple="props.component.multiple || ['transfer', 'checkbox'].includes(props.component.formType)"
    @change="handlerChangeeEvent"
  />
</template>
  
<script setup>
import { ref, inject } from 'vue'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const dicts = inject('dicts')

const handlerChangeeEvent = (value) => {

}
</script>