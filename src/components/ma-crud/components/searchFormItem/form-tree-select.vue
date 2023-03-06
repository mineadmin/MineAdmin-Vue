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
  <a-tree-select
    v-model="value"
    :treeProps="props.component.treeProps"
    :placeholder="props.component.searchPlaceholder || `请选择${props.component.title}`"
    allow-clear
    allow-search
    :field-names="props.component.dict.props || { key: 'value', title: 'label' }"
    :tree-checkable="props.component.multiple"
    :multiple="props.component.multiple"
    :data="dicts[props.component.dataIndex]"
  />
</template>
  
<script setup>
import { ref, inject, watch } from 'vue'
import { get, set } from 'lodash'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const dicts = inject('dicts')

const value = ref(get(searchForm.value, props.component.dataIndex, []))

watch( () => get(searchForm.value, props.component.dataIndex), vl => value.value = vl )
watch( () => value.value, v => set(searchForm.value, props.component.dataIndex, v) )
</script>