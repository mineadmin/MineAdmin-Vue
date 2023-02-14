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
  <a-spin :loading="searchLoading" tip="加载数据中..." v-if="showSearch">
    <a-form
      :model="searchForm"
      layout="inline"
      :label-align="options?.searchLabelAlign"
      ref="search"
      @submit="handlerSearch"
    >
      <div :class="[ gridClass, options?.searchCustomClass ]">
        <template v-for="(item, index) in searchColumns" :key="index">
          <a-form-item
            :field="item.dataIndex"
            :label="item.title"
            :label-col-style="{ width: item.searchLabelWidth ?? options.searchLabelWidth }"
          >
            <slot :name="`${item.dataIndex}`" v-bind="{ searchForm, item }">
              <component
                :is="getComponentName(item)"
                v-bind="item"
              />
            </slot>
          </a-form-item>
        </template>
      </div>
      <div class="text-center mt-5 w-full">
        <a-space size="medium">
          <a-button type="primary" html-type="submit"><icon-search /> 提交</a-button>
          <a-button @click="reset"><icon-delete /> 清空</a-button>
          <slot name="searchButtons" />
        </a-space>
      </div>
    </a-form>
  </a-spin>
</template>

<script setup>
import { ref, watch, inject, provide } from 'vue'
import MaFormInput from '@/components/ma-newForm/formItem/form-input.vue'
import MaFormPicker from '@/components/ma-newForm/formItem/form-picker.vue'
import MaFormSelect from '@/components/ma-newForm/formItem/form-select.vue'
import MaFormCascader from '@/components/ma-newForm/formItem/form-cascader.vue'
import MaFormTreeSelect from '@/components/ma-newForm/formItem/form-tree-select.vue'
import { upperCaseFirst } from '@/components/ma-newForm/js/utils'
import { isFunction, isArray, concat } from 'lodash'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'
import { handlerProps } from '../js/common'

const options = inject('options')
const columns = inject('columns')

const gridClass = ref(['ma-search-grid', 'w-full', 'grid', 'lg:grid-cols-' + options.searchColNumber ?? 4])

const searchLoading = ref(false)
const showSearch = ref(true)
const search = ref(null)
const searchColumns = ref([])

const searchForm = ref({})

provide('formModel', searchForm.value)

const emits = defineEmits(['search'])

if (columns.length > 0) {
  searchColumns.value = columns.filter( item => item.search === true )
}

const getComponentName = (formType) => {
  if (['select', 'radio', 'checkbox', 'transfer'].includes(formType)) {
    return `MaForm${upperCaseFirst(formType)}`
  } else if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(formType)) {
    return `MaFormPicker`
  } else if (formType === 'cascader') {
    return 'MaFormCascader'
  } else if (formType === 'tree-select') {
    return 'MaFormTreeSelect'
  } else {
    return 'MaFormInput'
  }
}
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
