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
  <a-spin :loading="searchLoading" :tip="options.searchLoadingText" v-if="showSearch">
    <a-form
      :model="searchForm"
      layout="inline"
      :label-align="options?.searchLabelAlign"
      ref="searchRef"
      @submit="handlerSearch"
    >
      <div :class="[ gridClass, options?.searchCustomClass ]">
        <template v-for="(component, index) in searchColumns" :key="index">
          <a-form-item
            :field="component.dataIndex"
            :label="component.title"
            label-col-flex="auto"
            :label-col-style="{ width: component.searchLabelWidth ?? options.searchLabelWidth }"
          >
            <slot :name="`${component.dataIndex}`" v-bind="{ searchForm, component }">
              <component :is="getComponentName(component.formType, component)" :component="component" />
            </slot>
          </a-form-item>
        </template>
      </div>
      <div class="text-center mt-5 w-full">
        <a-space size="medium">
          <slot name="searchBeforeButtons" />
          <slot name="searchButtons">
            <a-button type="primary" html-type="submit">
              <template #icon><icon-search /></template>
              {{ options.searchSubmitButtonText }}
            </a-button>
            <a-button @click="resetSearch">
              <template #icon><icon-delete /></template>
              {{ options.searchResetButtonText }}
            </a-button>
          </slot>
          <slot name="searchAfterButtons" />
        </a-space>
      </div>
    </a-form>
  </a-spin>
</template>

<script setup>
import { ref, watch, inject, provide, markRaw } from 'vue'
import MaFormInput from './searchFormItem/form-input.vue'
import MaFormPicker from './searchFormItem/form-picker.vue'
import MaFormSelect from './searchFormItem/form-select.vue'
import MaFormCascader from './searchFormItem/form-cascader.vue'
import MaFormTreeSelect from './searchFormItem/form-tree-select.vue'
import { upperCaseFirst } from '@/components/ma-form/js/utils'
import {cloneDeep} from "lodash";

const options = inject('options')
const columns = inject('columns')
const requestParams = inject('requestParams')

const gridClass = ref(['ma-search-grid', 'w-full', 'grid', 'lg:grid-cols-' + options.searchColNumber ?? 4])

const searchLoading = ref(false)
const showSearch = ref(true)
const searchRef = ref(null)
const searchColumns = ref([])

const searchForm = ref({})

provide('searchForm', searchForm)
provide('columns', columns)

const emit = defineEmits(['search'])

if (columns.length > 0) {
  searchColumns.value = cloneDeep(columns.filter( item => item.search === true ))
}

const handlerSearch = () => {
  emit('search', searchForm.value)
}

const resetSearch = () => {
  searchRef.value.resetFields()
  emit('search', searchForm.value)
}

const componentList = ref({
  'MaFormSelect': markRaw(MaFormSelect),
  'MaFormPicker': markRaw(MaFormPicker),
  'MaFormCascader': markRaw(MaFormCascader),
  'MaFormTreeSelect': markRaw(MaFormTreeSelect),
  'MaFormInput': markRaw(MaFormInput),
}) 

const getComponentName = (formType, component) => {
  if (['select', 'radio', 'checkbox', 'transfer'].includes(formType)) {
    return componentList.value['MaFormSelect']
  } else if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(formType)) {
    component.formType = 'range'
    return componentList.value['MaFormPicker']
  } else if (formType === 'cascader') {
    return componentList.value['MaFormCascader']
  } else if (formType === 'tree-select') {
    return componentList.value['MaFormTreeSelect']
  } else {
    return componentList.value['MaFormInput']
  }
}

const setSearchHidden = () => showSearch.value = false
const setSearchDisplay = () => showSearch.value = true
const setSearchLoading = () => searchLoading.value = true
const setSearchUnLoading = () => searchLoading.value = false
const getSearchFormRef = () => searchRef.value
const getSearchColumns = () => searchColumns.value

defineExpose({
  getSearchFormRef, getSearchColumns, showSearch,
  setSearchHidden, setSearchDisplay, setSearchLoading, setSearchUnLoading
})
</script>

<style scoped lang="less">
:deep(.arco-form-item-label-required-symbol svg) {
  vertical-align: baseline !important;
}
@media (min-width: 1024px) {
  .lg\:grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr))
  }
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr))
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr))
  }
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr))
  }
  .lg\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr))
  }
  .lg\:grid-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr))
  }
  .lg\:grid-cols-7 {
    grid-template-columns: repeat(7, minmax(0, 1fr))
  }
  .lg\:grid-cols-8 {
    grid-template-columns: repeat(8, minmax(0, 1fr))
  }
  .lg\:grid-cols-9 {
    grid-template-columns: repeat(9, minmax(0, 1fr))
  }
  .lg\:grid-cols-10 {
    grid-template-columns: repeat(10, minmax(0, 1fr))
  }
  .lg\:grid-cols-11 {
    grid-template-columns: repeat(11, minmax(0, 1fr))
  }
  .lg\:grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr))
  }
}
</style>