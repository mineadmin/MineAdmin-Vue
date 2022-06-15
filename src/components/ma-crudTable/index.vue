<template>
  <a-layout-content class="flex flex-col">
    <search
      :columns="settingProps.columns"
      :search-label-width="settingProps.crud.searchLabelWidth"
      :search-label-align="settingProps.crud.searchLabelAlign"
      @search="searchHandler"
      id="__search-panel"
      ref="searchRef"
    >
      <template #buttons>
        <slot name="buttons"></slot>
      </template>
    </search>
    <div class="opartion-tools flex justify-between mb-3">
      <a-space>
        <!-- 新增 -->
        <a-button type="primary" v-if="defaultCrud.addBtn"><icon-plus /> {{ defaultCrud.addText }}</a-button>
        <a-button type="primary" status="success" v-if="defaultCrud.importBtn"><icon-upload /> {{ defaultCrud.importText }}</a-button>
        <a-button type="primary" status="danger" v-if="defaultCrud.exportBtn"><icon-download /> {{ defaultCrud.exportText }}</a-button>
        <slot name="operation"></slot>
      </a-space>
      <a-space>
        <a-tooltip content="刷新表格"><a-button shape="circle" @click="refresh"><icon-refresh /></a-button></a-tooltip>
        <a-tooltip content="显隐搜索"><a-button shape="circle" @click="toggleSearch"><icon-search /></a-button></a-tooltip>
        <a-tooltip content="设置"><a-button shape="circle" @click="tableSetting"><icon-settings /></a-button></a-tooltip>
        <slot name="tools"></slot>
      </a-space>
    </div>
    <a-table
      v-bind="$attrs"
      ref="table"
      :data="tableData"
      :loading="loading"
      :pagination="settingProps.pagination"
      :stripe="defaultCrud.stripe"
      :bordered="defaultCrud.bordered"
      :rowSelection="defaultCrud.rowSelection || undefined"
      :row-key="defaultCrud.rowSelection && defaultCrud.rowSelection.key || 'id'"
      :scroll="defaultCrud.scroll"
      :column-resizable="defaultCrud.resizable"
      :size="defaultCrud.size"
      :hide-expand-button-on-empty="defaultCrud.hideExpandButtonOnEmpty"
      :default-expand-all-rows="defaultCrud.expandAllRows"
    >
      <template #columns>
        <template v-for="(row, index) in columns" :key="index">
          <a-table-column
            :title="row.title" :data-index="row.dataIndex" :width="row.width"
            :ellipsis="true" :tooltip="row.dataIndex === '__operation' ? false : true" :align="row.align || 'center'" :fixed="row.dataIndex === '__index' ? 'left' : row.fixed"
            :sortable="row.sortable"
            v-if="! row.hide"
          >
            <template #cell="{ record, column, rowIndex }">
              <slot :name="row.dataIndex" v-bind="{ record, column, rowIndex }">
                <template v-if="row.dataIndex === '__index'">{{ getIndex(rowIndex) }}</template>
                <template v-if="row.dataIndex === '__operation'">
                  <a-space>
                    <a-button
                      v-if="defaultCrud.seeOperation"
                      size="mini"
                      type="text"
                      :status="defaultCrud.seeStatus"
                    ><icon-eye /> {{ defaultCrud.seeText }}</a-button>
                    <a-button
                      v-if="defaultCrud.editOperation"
                      size="mini"
                      type="text"
                      :status="defaultCrud.editStatus"
                    ><icon-edit /> {{ defaultCrud.editText }}</a-button>
                    <a-button
                      v-if="defaultCrud.deleteOperation"
                      size="mini"
                      type="text"
                      :status="defaultCrud.deleteStatus"
                    ><icon-delete /> {{ defaultCrud.deleteText }}</a-button>
                  </a-space>
                </template>
                <template v-if="row.dict && row.dict.translation">
                  {{ searchRef.dictTrans(row.dataIndex, record[row.dataIndex]) }}
                </template>
                <template v-else>{{ record[row.dataIndex] }}</template>
              </slot>
            </template>
            <template #summary-cell="{ column,record,rowIndex }">
              <slot name="summary-cell" v-bind="{ record, column, rowIndex }">{{ record[column.dataIndex] }}</slot>
            </template>
          </a-table-column>
        </template>
      </template>
    </a-table>
    <div class="mt-3 text-right">
      <a-pagination
        :total="total"
        v-if="total > 0 && openPagination && !settingProps.pagination"
        show-total show-jumper show-page-size
        :page-size-options="pageSizeOption"
        @page-size-change="pageSizeChangeHandler"
        @change="pageChangeHandler"
        :current="requestParams[config.request.page]"
        :page-size="requestParams[config.request.pageSize]"
        style="display: inline-flex"
      />
    </div>

    <column-setting ref="cs" v-model="columns" v-model:crud="defaultCrud" />
  </a-layout-content>
</template>

<script setup>
import config from '@/config/crudTable'
import { isFunction } from '@vue/shared'
import { ref, watch, nextTick } from 'vue'

import search from './components/search.vue'
import columnSetting from './components/columnSetting.vue'

const loading = ref(true)
const openPagination = ref(false)
const pageSizeOption = ref([10, 20, 30, 50, 100])
const total = ref(0)
const requestParams = ref({})
const columns = ref([])
const showSearch = ref(true)
const searchRef = ref(null)

const tableData = ref([])
const cs = ref(null)

const defaultCrud = ref({
  // 设置选择列
  rowSelection: undefined,
  // 是否显示边框
  bordered: { wrapper: true, cell: true },
  // 子节点为空隐藏节点按钮
  hideExpandButtonOnEmpty: true,
  // 默认展开所有行
  expandAllRows: false,
  // 斑马线
  stripe: true,
  // 表格大小
  size: 'large',
  // 是否有新增按钮
  addBtn: false,
  // 新增按钮文案
  addText: '新增',
  // 是否有导入按钮
  importBtn: false,
  // 导入按钮文案
  importText: '导入',
  // 是否有导出按钮
  exportBtn: false,
  // 导出按钮文案
  exportText: '导出',
  // 是否显示索引列
  showIndex: true,
  // 索引列名称
  indexLabel: '序号',
  // 设置请求数据label
  requestParamsLabel: undefined,
  // 表格滚动默认宽高
  scroll: { x: '100%', y: '100%' },
  // 调整列宽
  resizable: true,
  // 是否显示操作列
  operationColumn: false,
  // 操作列宽度
  operationWidth: '180',
  // 操作列名称
  operationColumnText: '操作',
  // 操作列删除按钮
  deleteOperation: false,
  // 删除按钮状态
  deleteStatus: 'danger',
  // 删除按钮文案
  deleteText: '删除',
  // 操作列编辑按钮
  editOperation: false,
  // 编辑按钮状态
  editStatus: 'warning',
  // 编辑按钮文案
  editText: '编辑',
  // 操作列查看按钮
  seeOperation: false,
  // 查看按钮状态
  seeStatus: 'success',
  // 查看按钮文案
  seeText: '查看',
})

watch(() => settingProps.pageSizeOption, (val) => {
  pageSizeOption.value = val
})

watch(() => settingProps.columns, () => {
  requestData()
})

const requestData = async () => {
  defaultCrud.value = Object.assign(defaultCrud.value, settingProps.crud)
  columns.value = Object.assign(settingProps.columns, {})
  if (defaultCrud.value.showIndex && columns.value.length > 0 && columns.value[0].dataIndex !== '__index') {
    columns.value.unshift({ title: defaultCrud.value.indexLabel, dataIndex: '__index', width: 70 })
  }
  if (defaultCrud.value.operationColumn && columns.value.length > 0 && columns.value[columns.value.length - 1].dataIndex !== '__operation') {
    columns.value.push({ title: defaultCrud.value.operationColumnText, dataIndex: '__operation', width: defaultCrud.value.operationWidth })
  }
  showSearch.value = true
  initRequestParams()
  await refresh()
}

const initRequestParams = () => {
  requestParams.value[config.request.page] = 1
  requestParams.value[config.request.pageSize] = config.pageSize
  if (settingProps.crud.requestParamsLabel) {
    requestParams.value[settingProps.crud.requestParamsLabel] = settingProps.crud.requestParams
  } else {
    requestParams.value = Object.assign(requestParams.value, settingProps.crud.requestParams)
  }
}

const requestHandle = async () => {

  loading.value = true

  isFunction(settingProps.crud.before) && settingProps.crud.before(requestParams.value)

  if (isFunction(settingProps.crud.api)) {
    const response = config.parseResponseData(await settingProps.crud.api(requestParams.value))
    if (response.rows) {
      tableData.value = response.rows
      total.value = response.total
      openPagination.value = true
    } else {
      tableData.value = response
    }
  } else {
    console.error(`CrudTable Error：crud.api not is Function.`)
  }

  isFunction(settingProps.crud.after) && settingProps.crud.after(tableData.value)

  loading.value = false
}

const refresh = async () => {
  if (settingProps.data) {
    loading.value = true
    const data = Array.isArray(settingProps.data) ? settingProps.data : config.parseResponseData(await settingProps.data(requestParams.value))
    if (data.rows) {
      tableData.value = data.rows
      openPagination.value = true
    } else {
      tableData.value = data
    }
    loading.value = false
  } else if (isFunction(settingProps.crud.api)) {
    // 请求处理
    await requestHandle()
  }
}

const searchHandler = (formData) => {
  if (settingProps.crud.requestParamsLabel && requestParams.value[settingProps.crud.requestParamsLabel]) {
    requestParams.value[settingProps.crud.requestParamsLabel] = Object.assign(requestParams.value[settingProps.crud.requestParamsLabel], formData)
  } else if (settingProps.crud.requestParamsLabel) {
    requestParams.value[settingProps.crud.requestParamsLabel] = Object.assign({}, formData)
  } else {
    requestParams.value = Object.assign(requestParams.value, formData)
  }
  refresh()
}

const pageSizeChangeHandler = (pageSize) => {
  requestParams.value[config.request.page] = 1
  requestParams.value[config.request.pageSize] = pageSize
  refresh()
}

const pageChangeHandler = (currentPage) => {
  requestParams.value[config.request.page] = currentPage
  refresh()
}

const toggleSearch = () => {
  const dom = document.querySelector('#__search-panel')
  dom.style.display = showSearch.value ? 'none' : 'block'
  showSearch.value = ! showSearch.value
}

const tableSetting = () => {
  cs.value.open()
}

const getIndex = (rowIndex) => {
  if (requestParams.value[config.request.page] == 1) {
    return rowIndex + 1
  } else {
    return requestParams.value[config.request.page] * requestParams.value[config.request.pageSize] + rowIndex
  }
}

const settingProps = defineProps({

  // 表格数据
  data: { type: [ Function, Array ], default: () => null },
  // 是否开启表格分页
  pagination: { type: Boolean, default: false },
  // 设置每页记录数
  pageSizeOption: { type: Array, default: () => [] },

  // 增删改查设置
  crud: {
    type: Object,
    default: () => { return {
        // 请求api方法
        api: () => {},
        // 请求前置处理
        before: () => {},
        // 请求后置处理
        after: () => {},
        // 请求参数
        requestParams: {},
        // 是否自动请求
        autoRequest: true,
      }
    }
  },
  
  // 字段列设置
  columns: {
    type: Object,
    default: () => {}
  }
})

if (typeof settingProps.crud.autoRequest == 'undefined' || settingProps.crud.autoRequest) {
  nextTick()
  requestData()
}

defineExpose({ refresh, requestParams, requestData })

</script>

<style scoped lang="scss">
#__search-panel {
  transition: display 1s; overflow: hidden;
}
</style>