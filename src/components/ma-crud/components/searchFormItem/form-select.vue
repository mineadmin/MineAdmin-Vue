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
    v-model="value"
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
  >
    <template #header v-if="props.component.multiple">
      <div style="padding: 6px 12px;" >
        <a-space>
          <a-checkbox :value="false" @change="handleSelectAll">全选/清除</a-checkbox>
          <a-button size="mini" type="outline" @click="handleInverse">反选</a-button>
        </a-space>
      </div>
    </template>
    <template #footer v-if="props.component?.dict?.openPage ?? false">
      <div class="flex justify-center">
        <a-pagination
          class="p-2"
          size="mini"
          :total="dataTotal"
          :page-size="props.component.dict.pageOption.pageSize"
          simple
          @change="handlePage"
        >
          <template #page-item-step="{ type }">
            <div>{{ type === 'previous' ? '上一页' : '下一页' }}</div>
          </template>
        </a-pagination>
      </div>
    </template>
  </a-select>
</template>
  
<script setup>
import { ref, inject, onMounted, nextTick, watch } from 'vue'
import { handlerCascader, loadDict } from '@cps/ma-form/js/networkRequest'
import { get, set, isUndefined, xor, isObject } from 'lodash'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const columns = inject('columns')
const dicts = inject('dicts')
const dataTotal = ref(0)
const dictIndex = props.component.dataIndex

let defaultValue

if ( props.component.multiple === true ) {
  defaultValue = props.component.searchDefaultValue ?? []
} else {
  defaultValue = props.component.searchDefaultValue ?? ''
}

if (isObject(props.component.dict)) {
  props.component.dict.pageOption = {
    page: 1,
    pageSize: props.component?.dict?.pageSize ?? 15
  }
}

const value = ref(get(searchForm.value, props.component.dataIndex, defaultValue))
set(searchForm.value, props.component.dataIndex, value.value)

const handleSelectAll = (status) => {
  if (isUndefined(value.value)) {
    value.value = []
  }
  if (status) {
    dicts.value[dictIndex].map(item=>{
      value.value.push(item.value)
    })
  } else {
    value.value = []
  }
}

const handleInverse = () => {
  if (isUndefined(value.value)) {
    value.value = []
  }
  const ids = []
  dicts.value[dictIndex].map( item => ids.push(item.value) )
  value.value = xor(ids, value.value)
}

const handlePage = async (page) => {
  props.component.dict.pageOption.page = page
  await loadDict(dicts.value, props.component)
}

watch( () => get(searchForm.value, props.component.dataIndex), vl => value.value = vl )
watch( () => value.value, v => set(searchForm.value, props.component.dataIndex, v) )

const handlerChangeeEvent = (value) => {
  handlerCascader(
    value, props.component, columns.value, dicts.value, searchForm.value
  )
}

onMounted(() => {
  setTimeout(() => {
    if (isObject(dicts.value[dictIndex])) {
      dataTotal.value = dicts.value[dictIndex]?.pageInfo?.total
    }
  }, 3000);
})
</script>