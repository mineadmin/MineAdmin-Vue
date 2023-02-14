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
  <a-cascader
    v-model="searchForm[props.component.dataIndex]"
    :placeholder="props.component.searchPlaceholder || `请选择${props.component.title}`"
    allow-clear
    allow-search
    :expand-trigger="props.component.trigger || 'click'"
    :options="dicts[props.component.dataIndex]"
    :multiple="props.component.multiple"
  />
</template>
  
<script setup>
import { ref, inject } from 'vue'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const dicts = inject('dicts')
</script>