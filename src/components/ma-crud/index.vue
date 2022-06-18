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
        <a-button
          type="primary"
          v-if="defaultCrud.add.show"
          v-auth="defaultCrud.add.auth || []"
          v-role="defaultCrud.add.role || []"
          @click="addAction"
        ><icon-plus /> {{ defaultCrud.add.text || '新增' }}</a-button>
        <a-button
          type="primary"
          status="success"
          v-auth="defaultCrud.import.auth || []"
          v-role="defaultCrud.import.role || []"
          v-if="defaultCrud.import.show"
        ><icon-upload /> {{ defaultCrud.import.text || '导入' }}</a-button>
        <a-button
          type="primary"
          status="danger"
          v-auth="defaultCrud.export.auth || []"
          v-role="defaultCrud.export.role || []"
          v-if="defaultCrud.export.show"
        ><icon-download /> {{ defaultCrud.export.text || '导出' }}</a-button>
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
              <template v-if="row.dataIndex === '__operation'">
                <a-space>
                  <a-button
                    v-if="defaultCrud.see.show"
                    size="mini" type="text" status="success"
                    v-auth="defaultCrud.see.auth || []"
                    v-role="defaultCrud.see.role || []"
                  ><icon-eye /> {{ defaultCrud.see.text || '查看' }}</a-button>
                  <a-button
                    v-if="defaultCrud.edit.show"
                    size="mini" type="text" status="warning"
                    v-auth="defaultCrud.edit.auth || []"
                    v-role="defaultCrud.edit.role || []"
                    @click="editAction(record)"
                  ><icon-edit /> {{ defaultCrud.edit.text || '编辑' }}</a-button>
                  <a-button
                    v-if="defaultCrud.delete.show"
                    size="mini" type="text" status="danger"
                    v-auth="defaultCrud.delete.auth || []"
                    v-role="defaultCrud.delete.role || []"
                  ><icon-delete /> {{ defaultCrud.delete.text || '删除' }}</a-button>
                  <slot name="operationExtend" v-bind="{ record, column, rowIndex }"></slot>
                </a-space>
              </template>
              <slot :name="row.dataIndex" v-bind="{ record, column, rowIndex }" v-else >
                <template v-if="row.dataIndex === '__index'">{{ getIndex(rowIndex) }}</template>
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

    <data-view-page
      ref="dvp"
      v-model="columns"
      v-model:crud="defaultCrud"
      @success="requestSuccess"
    />

  </a-layout-content>
</template>

<script setup>
import config from '@/config/crud'
import { isFunction } from '@vue/shared'
import { ref, watch, nextTick } from 'vue'

import search from './components/search.vue'
import dataViewPage from './components/data.vue'
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
const dvp = ref(null)

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
  // 新增、编辑、删除完成后是否刷新表格
  dataCompleteRefresh: true,
  // 表格大小
  size: 'large',
  // 新增和编辑显示设置
  viewLayoutSetting: {
    // 显示方式支持模态框和抽屉: modal drawer
    viewType: 'modal',
    // 显示宽度 
    width: 600,
    // 是否全屏，只有modal有效    
    isFull: false,
    // 表单设置一行多少列，会自适应
    cols: 1,
    // 标签对齐方式
    labelAlign: 'right'
  },
  add: {
    // 新增api
    api: undefined,
    // 显示新增按钮的权限
    auth: [],
    // 显示新增按钮的角色
    role: [],
    // 按钮文案
    text: '新增',
    // 是否显示
    show: false,
  },
  edit: {
    // 编辑api
    api: undefined,
    // 显示编辑按钮的权限
    auth: [],
    // 显示编辑按钮的角色
    role: [],
    // 按钮文案
    text: '编辑',
    // 是否显示
    show: false,
  },
  delete: {
    // 删除api
    api: undefined,
    // 显示删除按钮的权限
    auth: [],
    // 显示删除按钮的角色
    role: [],
    // 按钮文案
    text: '删除',
    // 是否显示
    show: false,
  },
  see: {
    // 显示查看按钮的权限
    auth: [],
    // 显示查看按钮的角色
    role: [],
    // 按钮文案
    text: '查看',
    // 是否显示
    show: false,
  },
  import: {
    // 导入api
    api: undefined,
    // 显示导入按钮的权限
    auth: [],
    // 显示导入按钮的角色
    role: [],
    // 按钮文案
    text: '导入',
    // 是否显示
    show: false,
  },
  export: {
    // 导出url
    url: undefined,
    // 显示导出按钮的权限
    auth: [],
    // 显示导出按钮的角色
    role: [],
    // 按钮文案
    text: '导出',
    // 是否显示
    show: false,
  },
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
  operationWidth: 180,
  // 操作列名称
  operationColumnText: '操作',
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

const requestSuccess = response => {
  defaultCrud.value.dataCompleteRefresh && refresh()
}

const getIndex = (rowIndex) => {
  if (requestParams.value[config.request.page] == 1) {
    return rowIndex + 1
  } else {
    return requestParams.value[config.request.page] * requestParams.value[config.request.pageSize] + rowIndex
  }
}

const addAction = () => dvp.value.add()

const editAction = (record) => dvp.value.edit(record)

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