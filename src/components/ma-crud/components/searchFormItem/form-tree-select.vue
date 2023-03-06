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
    :treeProps="{ virtualListProps: props.component.virtualListProps }"
    :placeholder="props.component.searchPlaceholder || `请选择${props.component.title}`"
    allow-clear
    allow-search
    :field-names="props.component.dict.props || { key: 'value', title: 'label' }"
    :tree-checkable="props.component.multiple"
    :multiple="props.component.multiple"
    :block-node="props.component.blockNode"
    :default-expand-all="props.component.defaultExpanAll"
    :default-selected-keys="props.component.defaultSelectedKeys"
    :selected-keys="props.component.selectedKeys"
    :default-checked-keys="props.component.defaultCheckedKeys"
    :checked-keys="props.component.checkedKeys"
    :default-expanded-keys="props.component.defaultExpandedKeys"
    :expanded-keys="props.component.expandedKeys"
    :show-line="props.component.showLine"
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