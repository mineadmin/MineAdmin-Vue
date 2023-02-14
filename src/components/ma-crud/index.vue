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
  <a-layout-content class="flex flex-col lg:h-full relative w-full">
    <div class="_crud-header flex flex-col mb-2" ref="crudHeaderRef">
      <ma-search
        @search="searchHandler"
        class="__search-panel"
        ref="maCrudSearch"
      >
        <template
          v-for="(slot, slotIndex) in searchSlots"
          :key="slotIndex"
          #[slot]="{ searchForm, item }"
        >
          <slot :name="`search-${slot}`" v-bind="{ searchForm, item }" />
        </template>
        <template #searchButtons>
          <slot name="searchButtons"></slot>
        </template>
      </ma-search>
    </div>
    <!-- <div class="_crud-content">
      <div class="operation-tools lg:flex justify-between mb-3" ref="crudOperationRef">
        <a-space class="lg:flex block lg:inline-block" >
          <slot name="tableBeforeButtons"></slot>
          <slot name="tableButtons">
            <a-button
              v-if="options.add.show"
              v-auth="options.add.auth || []"
              v-role="options.add.role || []"
              @click="addAction" type="primary"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><icon-plus /> {{ options.add.text || '新增' }}</a-button>

            <a-popconfirm
              content="确定要删除数据吗?"
              position="bottom"
              @ok="deletesMultipleAction"
            >
              <a-button
                v-if="options.delete.show"
                v-auth="options.delete.auth || []"
                v-role="options.delete.role || []"
                type="primary" status="danger"
                class="w-full lg:w-auto mt-2 lg:mt-0"
              ><icon-delete /> {{ isRecovery ? options.delete.realText || '删除' : options.delete.text || '删除' }}</a-button>
            </a-popconfirm>

            <a-popconfirm
              content="确定要恢复数据吗?"
              position="bottom"
              @ok="recoverysMultipleAction"
            >
              <a-button
                v-if="options.recovery.show && isRecovery"
                v-auth="options.recovery.auth || []"
                v-role="options.recovery.role || []"
                type="primary" status="success"
                class="w-full lg:w-auto mt-2 lg:mt-0"
              ><icon-undo /> {{ options.recovery.text || '恢复' }}</a-button>
            </a-popconfirm>

            <a-button
              v-if="options.import.show"
              v-auth="options.import.auth || []"
              v-role="options.import.role || []"
              @click="importAction"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><icon-upload /> {{ options.import.text || '导入' }}</a-button>

            <a-button
              v-if="options.export.show"
              v-auth="options.export.auth || []"
              v-role="options.export.role || []"
              @click="exportAction"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><icon-download /> {{ options.export.text || '导出' }}</a-button>

            <a-button
              type="secondary"
              @click="handlerExpand"
              v-if="options.isExpand"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            >
              <icon-expand v-if="! expandState" />
              <icon-shrink v-else />
              {{ expandState ? ' 折叠' : ' 展开' }}
            </a-button>
          </slot>
          <slot name="tableAfterButtons"></slot>
        </a-space>
        <a-space class="lg:mt-0 mt-2" v-if="options.showTools">
          <slot name="tools"></slot>
          <a-tooltip
            :content="isRecovery ? '显示正常数据' : '显示回收站数据'"
            v-if="options.recycleApi && isFunction(options.recycleApi)"
          >
            <a-button
              shape="circle"
              @click="switchDataType"
            ><icon-swap /></a-button>
          </a-tooltip>
          <a-tooltip content="刷新表格"><a-button shape="circle" @click="refresh"><icon-refresh /></a-button></a-tooltip>
          <a-tooltip content="显隐搜索"><a-button shape="circle" @click="toggleSearch"><icon-search /></a-button></a-tooltip>
          <a-tooltip content="设置"><a-button shape="circle" @click="tableSetting"><icon-settings /></a-button></a-tooltip>
        </a-space>
      </div>
      <div ref="crudContentRef">
        <slot name="content" v-bind="tableData">
          <a-table
            v-bind="$attrs"
            ref="tableRef"
            :key="options.pk"
            :data="tableData"
            :loading="loading"
            :sticky-header="options.stickyHeader"
            :pagination="props.pagination"
            :stripe="options.stripe"
            :bordered="options.bordered"
            :rowSelection="options.rowSelection || undefined"
            :row-key="options.rowSelection && options.rowSelection.key || 'id'"
            :scroll="options.scroll"
            :column-resizable="options.resizable"
            :size="options.size"
            :hide-expand-button-on-empty="options.hideExpandButtonOnEmpty"
            :default-expand-all-rows="options.expandAllRows"
            :summary="options.customerSummary || __summary || options.showSummary"
            @selection-change="setSelecteds"
            @sorter-change="handlerSort"
          >
            <template #tr="{ record }">
              <tr class="ma-crud-table-tr" @dblclick="dbClickOpenEdit(record)" />
            </template>

            <template #expand-row="record" v-if="options.showExpandRow">
              <slot name="expand-row" v-bind="record"></slot>
            </template>
            <template #columns>
              <ma-column
                v-if="reloadColumn"
                :options="options"
                :columns="columns"
                :searchRef="maCrudSearch"
                :formRef="maCrudForm"
                :isRecovery="isRecovery"
                :params="requestParams"
                @refresh="() => refresh()"
                @showImage="showImage"
              >
                <template #operationBeforeExtend="{ record, column, rowIndex }">
                  <slot name="operationBeforeExtend" v-bind="{ record, column, rowIndex }"></slot>
                </template>

                <template #operationCell="{ record, column, rowIndex }">
                  <slot name="operationCell" v-bind="{ record, column, rowIndex }"></slot>
                </template>

                <template #operationAfterExtend="{ record, column, rowIndex }">
                  <slot name="operationAfterExtend" v-bind="{ record, column, rowIndex }"></slot>
                </template>

                <template
                  v-for="(slot, slotIndex) in slots"
                  :key="slotIndex"
                  #[slot]="{ record, column, rowIndex }"
                >
                  <slot :name="`${slot}`" v-bind="{ record, column, rowIndex }" />
                </template>
              </ma-column>
            </template>
            <template #summary-cell="{ column, record, rowIndex }" v-if="options.customerSummary || options.showSummary">
              <slot name="summaryCell" v-bind="{ record, column, rowIndex }">{{ record[column.dataIndex] }}</slot>
            </template>
          </a-table>
        </slot>
      </div>
    </div>
    <div class="_crud-footer mt-3 text-right" ref="crudFooterRef" v-if="total > 0 && openPagination && !props.pagination">
      <a-pagination
        :total="total"
        show-total show-jumper show-page-size
        :page-size-options="pageSizeOption"
        @page-size-change="pageSizeChangeHandler"
        @change="pageChangeHandler"
        v-model:current="requestParams[config.request.page]"
        :page-size="requestParams[config.request.pageSize]"
        style="display: inline-flex"
      />
    </div> -->

    <!-- <ma-setting
      ref="maCrudSetting"
      v-model="columns"
      v-model:crud="options"
    />

    <ma-form
      ref="maCrudForm"
      v-model="columns"
      v-model:crud="options"
      @success="requestSuccess"
    />

    <ma-import
      ref="maCrudImport"
      v-model="options.import"
    />

    <a-image-preview :src="imgUrl" v-model:visible="imgVisible" /> -->
  </a-layout-content>
</template>

<script setup>
import config from '@/config/crud'
import { isFunction } from '@vue/shared'
import { ref, watch, provide, nextTick } from 'vue'
import defaultOptions from './js/defaultOptions'

import MaSearch from './components/search.vue'
import MaForm from './components/form.vue'
import MaSetting from './components/setting.vue'
import MaImport from './components/import.vue'
import MaColumn from './components/column.vue'
import checkAuth from '@/directives/auth/auth'
import checkRole from '@/directives/role/role'
import { Message } from '@arco-design/web-vue'
import { request } from '@/utils/request'
import tool from '@/utils/tool'
import { isArray } from 'lodash'
import globalColumn from '@/config/column.js'

const props = defineProps({
  // 表格数据
  data: { type: [ Function, Array ], default: () => null },
  // 增删改查设置
  options: Object,
  // 字段列设置
  columns: { type: Array, default: [] }
})

const loading = ref(true)
const reloadColumn = ref(true)
const openPagination = ref(false)
const imgVisible = ref(false)
const imgUrl = ref('not-image.png')
const pageSizeOption = ref([10, 20, 30, 50, 100])
const total = ref(0)
const requestParams = ref({})
const columns = ref([])
const slots = ref([])
const searchSlots = ref([])
const showSearch = ref(true)
const isRecovery = ref(false)
const expandState = ref(false)

const crudHeaderRef = ref(null)
const crudOperationRef = ref(null)
const crudContentRef = ref(null)
const crudFooterRef = ref(null)
const headerHeight = ref(0)

const selecteds = ref([])

const tableData = ref([])
const tableRef = ref()
const currentApi = ref()

const maCrudSearch = ref(null)
const maCrudSetting = ref(null)
const maCrudForm = ref(null)
const maCrudImport = ref(null)

const options = ref(Object.assign(defaultOptions, props.options))

provide('options', options.value)
provide('columns', props.columns)

watch(() => options.pageSizeOption, (val) => {
  pageSizeOption.value = val
})

watch(
  () => {
    return {
      pageLayout: options.value.pageLayout,
      openPagination: openPagination.value,
    }
  },
  (val, oldValue) => {
    if (val.pageLayout == 'fixed') {
      nextTick(() => {
        headerHeight.value = crudHeaderRef.value.offsetHeight
        settingFixedPage(val.openPagination)
      })
    }
  }
)

watch(() => options.value.requestParams, (val) => {
  requestParams.value = val
}, { deep: true })

watch(() => props.api, () => {
  requestData()
}, { deep: true })

const getSlot = (cls = []) => {
  let sls = []
  cls.map(item => {
    if (item.children && item.children.length > 0) {
      let tmp = getSlot(item.children)
      sls.push(...tmp)
    } else if (item.dataIndex) {
      sls.push(item.dataIndex)
    }
  })
  return sls
}

const showImage = url => {
  imgUrl.value = url
  imgVisible.value = true
}

const getSearchSlot = () => {
  let sls = []
  props.columns.map(item => {
    if (item.search && item.search === true) {
      sls.push(item.dataIndex)
    }
  })
  return sls
}

slots.value = getSlot(props.columns)
searchSlots.value = getSearchSlot(props.columns)

const requestData = async () => {
  options.value = Object.assign(options.value, options.value)
  columns.value = Object.assign(props.columns, {})
  columns.value.map((item, index) => {
    // 公用模板
    if (item.common && globalColumn[item.dataIndex]) {
      columns.value[index] = globalColumn[item.dataIndex]
    }
    !item.width && (item.width = options.value.columnWidth)
  })
  if (options.value.showIndex && columns.value.length > 0 && columns.value[0].dataIndex !== '__index') {
    columns.value.unshift({ title: options.value.indexLabel, dataIndex: '__index', width: 70, fixed: 'left' })
  }
  if (options.value.operationColumn && columns.value.length > 0 && columns.value[columns.value.length - 1].dataIndex !== '__operation') {
    columns.value.push({ title: options.value.operationColumnText, dataIndex: '__operation', width: options.value.operationWidth, align: 'right', fixed: 'right' })
  }
  showSearch.value = !options.value.expandSearch
  initRequestParams()
  await refresh()
}

const initRequestParams = () => {
  requestParams.value[config.request.page] = 1
  requestParams.value[config.request.pageSize] = props.pageSize ?? config.pageSize
  if (options.value.requestParamsLabel) {
    requestParams.value[options.value.requestParamsLabel] = options.value.requestParams
  } else {
    requestParams.value = Object.assign(requestParams.value, options.value.requestParams)
  }
}

const requestHandle = async () => {

  loading.value = true

  isFunction(options.value.beforeRequest) && options.value.beforeRequest(requestParams.value)

  if (isFunction(currentApi.value)) {
    const response = config.parseResponseData(await currentApi.value(requestParams.value))
    if (response.rows) {
      tableData.value = response.rows
      if (response.pageInfo) {
        total.value = response.pageInfo.total
        openPagination.value = true
      }
    } else {
      tableData.value = response
    }
  } else {
    console.error(`ma-crud error：crud.api not is Function.`)
  }
  isFunction(options.value.afterRequest) && options.value.afterRequest(tableData.value)
  loading.value = false
}

const refresh = async () => {
  if (props.data) {
    loading.value = true
    const data = isArray(props.data) ? props.data : config.parseResponseData(await props.data(requestParams.value))
    if (data.rows) {
      tableData.value = data.rows
      openPagination.value = true
    } else {
      tableData.value = data
    }
    loading.value = false
  } else {
    currentApi.value = isRecovery.value && options.value.recycleApi && isFunction(options.value.recycleApi)
    ? options.value.recycleApi
    : options.value.api
    await requestHandle()
  }
}

const searchHandler = (formData) => {
  if (options.value.requestParamsLabel && requestParams.value[options.value.requestParamsLabel]) {
    requestParams.value[options.value.requestParamsLabel] = Object.assign(requestParams.value[options.value.requestParamsLabel], formData)
  } else if (options.value.requestParamsLabel) {
    requestParams.value[options.value.requestParamsLabel] = Object.assign({}, formData)
  } else {
    requestParams.value = Object.assign(requestParams.value, formData)
  }
  if (options.value.beforeSearch && isFunction(options.value.beforeSearch)) {
    options.value.beforeSearch(requestParams.value)
  }
  pageChangeHandler(1)
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
  const dom = crudHeaderRef.value?.style
  if (dom) {
    dom.display = showSearch.value ? 'none' : 'block'
    showSearch.value = ! showSearch.value
    if (openPagination.value) {
      headerHeight.value = crudHeaderRef.value.offsetHeight == 0 ? 24 : crudHeaderRef.value.offsetHeight + 32
    } else {
      headerHeight.value = crudHeaderRef.value.offsetHeight == 0 ? -8 : crudHeaderRef.value.offsetHeight
    }
    options.value.pageLayout == 'fixed' && settingFixedPage()
  }
}

const tableSetting = () => {
  maCrudSetting.value.open()
}

const requestSuccess = async response => {
  if (response && response.code && response.code == 200) {
    options.value.dataCompleteRefresh && await refresh()
    if (reloadColumn.value) {
      reloadColumn.value = false
      nextTick(() => {
        reloadColumn.value = true
      })
    }
  }
}

const getIndex = (rowIndex) => {
  if (requestParams.value[config.request.page] == 1) {
    return rowIndex + 1
  } else {
    return requestParams.value[config.request.page] * requestParams.value[config.request.pageSize] + rowIndex
  }
}

const addAction = () => {
  isFunction(options.value.beforeOpenAdd) && options.value.beforeOpenAdd()
  maCrudForm.value.add()
}

const editAction = (record) => {
  isFunction(options.value.beforeOpenEdit) && options.value.beforeOpenEdit(record)
  maCrudForm.value.edit(record)
}

const dbClickOpenEdit = (record) => {
  if (options.value.isDbClickEdit) {
    if (isRecovery.value) {
      Message.error('回收站数据不可编辑')
      return
    }

    if (isArray(options.value.edit.auth)) {
      for (let index in options.value.edit.auth) {
        if (! checkAuth(options.value.edit.auth[index])) {
          Message.error('没有编辑数据的权限')
          return
        }
      }

      if (options.value.edit.api && isFunction(options.value.edit.api)) {
        editAction(record)
      }
    }
    
  }
}

const importAction = () => maCrudImport.value.open()

const exportAction = () => {
  Message.info('请求服务器下载文件中...')
  const data = options.value.requestParamsLabel ? requestParams.value[options.value.requestParamsLabel] : requestParams.value
  const download = (url) => request({ url, data, method: 'post', timeout: 60 * 1000, responseType: 'blob' })

  download(options.value.export.url).then(res => {
    tool.download(res)
    Message.success('请求成功，文件开始下载')
  }).catch(e => {
    Message.error('请求服务器错误，下载失败')
  })
}

const deletesMultipleAction = async () => {
  if (selecteds.value && selecteds.value.length > 0) {
    const api = isRecovery.value ? options.value.delete.realApi : options.value.delete.api
    let data = {}
    if (options.value.beforeDelete && isFunction(options.value.beforeDelete)) {
      data = options.value.beforeDelete()
    }
    const response = await api(Object.assign( { ids: selecteds.value }, data ))
    if (options.value.afterDelete && isFunction(options.value.afterDelete)) {
      options.value.afterDelete(response)
    }
    Message.success(response.message || `删除成功！`)
    refresh()
  } else {
    Message.error('至少选择一条数据')
  }
}

const recoverysMultipleAction = async() => {
  if (selecteds.value && selecteds.value.length > 0) {
    const response = await options.value.recovery.api({ ids: selecteds.value })
    Message.success(response.message || `恢复成功！`)
    refresh()
  } else {
    Message.error('至少选择一条数据')
  }
}

const setSelecteds = (key) => {
  selecteds.value = key
}

const switchDataType = () => {
  isRecovery.value = ! isRecovery.value
  currentApi.value = isRecovery.value && options.value.recycleApi && isFunction(options.value.recycleApi)
    ? options.value.recycleApi
    : options.value.api
  requestData()
}

const handlerExpand = () => {
  expandState.value = ! expandState.value
  expandState.value ? tableRef.value.expandAll(true) : tableRef.value.expandAll(false)
}

const handlerSort = (name, type) => {
  const col = columns.value.find(item => name == item.dataIndex)
  if (col.sortable && col.sortable.sorter) {
    if (type) {
      requestParams.value.orderBy = name
      requestParams.value.orderType = type === 'ascend' ? 'asc' : 'desc'
    } else {
      requestParams.value.orderBy = undefined
      requestParams.value.orderType = undefined
    }
    requestData()
  }
}

const getTableData = () => {
  return tableData.value
}

const __summary = ({ data }) => {
  if (options.value.showSummary && isArray(options.value.summary)) {
    const summary = options.value.summary
    let summaryData = {}
    let length = data.length || 0
    summary.map( item => {
      summaryData[item.dataIndex] = 0
      data.map(record => {
        if (record[item.dataIndex]) {
          if (item.action && item.action == 'sum') {
            summaryData[item.dataIndex] += parseFloat(record[item.dataIndex])
          }
          if (item.action && item.action == 'avg') {
            summaryData[item.dataIndex] += parseFloat(record[item.dataIndex]) / length
          }
        }
      })
    })

    for (let i in summaryData) {
      summaryData[i] = tool.groupSeparator(summaryData[i].toFixed(2))
    }

    return [ summaryData ]
  }
}

if (typeof options.value.autoRequest == 'undefined' || options.value.autoRequest) {
  nextTick()
  requestData()
}

nextTick(() => {
  document.querySelector('.arco-table-body').className += ' customer-scrollbar'
  toggleSearch()
})

const settingFixedPage = (openPage = false) => {
  const workAreaHeight = document.querySelector('.work-area').offsetHeight
  const tempHeight = headerHeight.value + 120 + (openPage ? 32 : -12)
  const tableHeight = workAreaHeight - tempHeight
  crudContentRef.value.style.height = tableHeight + 'px'
}

defineExpose({
  refresh, requestData, addAction, editAction, getTableData, setSelecteds,
  requestParams, isRecovery, tableRef,
  maCrudForm, maCrudSearch, maCrudImport, maCrudSetting
})

</script>

<style scoped lang="less">
.__search-panel {
  transition: display 1s; overflow: hidden; width: 100%;
}
._crud-footer {
  z-index: 10;
}
</style>
