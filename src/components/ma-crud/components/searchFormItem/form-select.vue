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
    :show-extra-options="false"
    :fallback-option="handlerFallback"
    :loading="loading"
    @change="handlerChangeeEvent"
  >
    <template #header v-if="props.component.multiple && props.component.multipleTools">
      <div style="padding: 6px 12px;" >
        <a-space fill>
          <a-checkbox
            v-if="isBoolean(props.component.multipleTools) || props.component.multipleTools.selectAll"
            :model-value="checkedAll"
            :indeterminate="indeterminate"
            :disabled="loading"
            @change="handleSelectAll">全选/清除</a-checkbox>

          <a-button
            v-if="isBoolean(props.component.multipleTools) || props.component.multipleTools.inverse"
            class="ml-2"
            size="mini"
            type="outline"
            :disabled="loading"
            @click="handleInverse">反选</a-button>

            <a-popover :content-style="{padding: '0px',width: '256px'}" position="rt" trigger="click" v-if="isBoolean(props.component.multipleTools) || props.component.multipleTools.showSelectAll">
              <a-button class="ml-2" size="mini">已选 {{ value.length }}</a-button>
              <template #title>
                <a-space fill style="padding: 12px 12px 8px 12px;"> 
                  <a-button
                  :disabled="loading || !value.length"
                  size="mini"
                  status="danger"
                  @click="value = []">清空 {{ value.length }}</a-button>
                  <a-input-search
                  v-model="keyword"
                  size="mini"
                  allow-clear
                  />
                </a-space>
              </template>
              <template #content>
                <a-scrollbar style="height: 200px;overflow: auto;">
                  <a-checkbox-group 
                  v-if="(value.length && keyword === '') || Object.keys(filteredOptions).length > 0"
                  direction="vertical"
                  v-model="value">
                    <div v-for="item in filteredOptions" class="select-all-options">
                      <a-checkbox :value="item.value">{{  item.label }}</a-checkbox>
                    </div>
                  </a-checkbox-group>
                  <a-empty v-else />
                </a-scrollbar>
              </template>
            </a-popover>
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
          :disabled="loading"
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
import { ref, inject, onMounted, computed, watch } from 'vue'
import { handlerCascader, loadDict } from '@cps/ma-form/js/networkRequest'
import { get, set, isUndefined, xor, isObject, isBoolean } from 'lodash'
const props = defineProps({
  component: Object,
})
const searchForm = inject('searchForm')
const columns = inject('columns')
const dicts = inject('dicts')
const dataTotal = ref(0)
const dictIndex = props.component.dataIndex
const loading = ref(false)
const optionMap = ref({})
const keyword = ref('')

let defaultValue

if ( props.component.multiple === true ) {
  defaultValue = props.component.searchDefaultValue ?? []
} else {
  defaultValue = props.component.searchDefaultValue ?? ''
}

if ( isUndefined(props.component.multipleTools) ) props.component.multipleTools = true

if (isObject(props.component.dict)) {
  props.component.dict.pageOption = {
    page: 1,
    pageSize: props.component?.dict?.pageOption?.pageSize ?? props.component?.dict?.pageSize ?? 15
  }
}

const value = ref(get(searchForm.value, props.component.dataIndex, defaultValue))
set(searchForm.value, props.component.dataIndex, value.value)

const handleSelectAll = (status) => {
  if (isUndefined(value.value)) {
    value.value = []
  }
  if (status) {
    const currentSet = new Set(value.value)
    const newValues = dicts.value[dictIndex].filter(item => !currentSet.has(item.value)).map(item => item.value)
    value.value = [...value.value, ...newValues]
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
  value.value = xor(value.value, ids)
}

const handlePage = async (page) => {
  loading.value = true
  props.component.dict.pageOption.page = page
  await loadDict(dicts.value, props.component)
  loading.value = false
}

const handlerFallback = (key) => {
  return optionMap.value[key] || key
}

watch( () => get(searchForm.value, props.component.dataIndex), vl => value.value = vl )
watch( () => value.value, v => {
  if (props.component.multiple) {
    if (!isObject(v)) v = []
    v.forEach(k => {
      if ( !optionMap.value[k] ) {
        optionMap.value[k] = dicts.value[dictIndex].find(i => i.value === k)
      }
    })
    for(const k in optionMap.value) {
      if ( !v.includes(k) ) delete optionMap.value[k]
    }
  }
  set(searchForm.value, props.component.dataIndex, v)
} )
watch( () => dicts.value[dictIndex] , async v => {
  dataTotal.value = v?.pageInfo?.total || 0
})

const checkedAll = computed(() => {
  const { multiple, multipleTools } = props.component
  const currentDicts = dicts.value[dictIndex]

  if (multiple && multipleTools && currentDicts) {
    return currentDicts.every(item => value.value.includes(item.value))
  }

  return false
})

const filteredOptions = computed(() => {
  const { multiple, multipleTools } = props.component
  if (multiple && multipleTools && keyword.value !== '') {
    const lowerCaseKeyword = keyword.value.toLowerCase()
    return Object.values(optionMap.value).filter(option => 
      option.label.toLowerCase().includes(lowerCaseKeyword)
    )
  }
  return optionMap.value
})

const indeterminate = computed(() => {
  if (props.component.multiple && props.component.multipleTools && checkedAll.value == false) {
    const currentDicts = dicts.value[dictIndex]
    return currentDicts.some(item => value.value.includes(item.value))
  }
  return false
})

const handlerChangeeEvent = (value) => {
  handlerCascader(
    value, props.component, columns.value, dicts.value, searchForm.value
  )
}

onMounted(() => {
})
</script>
<style lang="less" scoped>
.arco-checkbox-group {
  width: 100%;
  .select-all-options {
    width: 100%;
    height: 36px;
    padding: 0 15px 0 7px;
    color: inherit;
    background-color: transparent;
    transition: all 0.1s cubic-bezier(0, 0, 1, 1);
    ::v-deep(.arco-checkbox .arco-checkbox-label) {
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:hover {
      color: var(--color-text-1);
      background-color: var(--color-fill-2);
    }
  }
}
</style>