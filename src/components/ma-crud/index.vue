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
      <a-tabs
          v-if="isArray(options.tabs.data) && options.tabs.data.length > 0"
          v-model:active-key="options.tabs.defaultKey"
          :trigger="options.tabs.trigger"
          :type="options.tabs.type"
          :hide-content="true"
          @change="tabChange"
          @tab-click="runEvent(options.tabs, 'onClick', undefined, $event)"
          class="ma-tabs mb-5"
      >
        <template #extra><slot name="tabExtra"></slot></template>
        <a-tab-pane :key="item.value" :title="item.label" v-for="item in options.tabs.data">
          <template #title><slot :name="'tabTitle-' + item.label">{{ item.label }}</slot></template>
        </a-tab-pane>
      </a-tabs>
      <ma-search
        @search="searchSubmitHandler"
        class="__search-panel"
        ref="crudSearchRef"
      >
        <template
          v-for="(slot, slotIndex) in getSearchSlot()"
          :key="slotIndex"
          #[slot]="{ searchForm, component }"
        >
          <slot :name="`search-${slot}`" v-bind="{ searchForm, component }" />
        </template>
        <template #searchBeforeButtons>
          <slot name="searchBeforeButtons"></slot>
        </template>
        <template #searchButtons>
          <slot name="searchButtons"></slot>
        </template>
        <template #searchAfterButtons>
          <slot name="searchAfterButtons"></slot>
        </template>
      </ma-search>
    </div>
    <div class="mb-2"><slot name="middleContent"></slot></div>
    <div class="_crud-content">
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
            >
              <template #icon><icon-plus /></template>{{ options.add.text || '新增' }}
            </a-button>

            <a-popconfirm
              content="确定要删除数据吗?"
              position="bottom"
              @ok="deletesMultipleAction"
              v-if="options.delete.show && isBatch(options.delete) && options.rowSelection"
            >
              <a-button
                v-auth="options.delete.auth || []"
                v-role="options.delete.role || []"
                type="primary" status="danger"
                class="w-full lg:w-auto mt-2 lg:mt-0"
              >
                <template #icon><icon-delete /></template>
                {{ isRecovery ? options.delete.realText || '删除' : options.delete.text || '删除' }}
              </a-button>
            </a-popconfirm>

            <a-popconfirm
              content="确定要恢复数据吗?"
              position="bottom"
              @ok="recoverysMultipleAction"
              v-if="options.recovery.show && isRecovery && isBatch(options.delete)"
            >
              <a-button
                v-auth="options.recovery.auth || []"
                v-role="options.recovery.role || []"
                type="primary" status="success"
                class="w-full lg:w-auto mt-2 lg:mt-0"
              >
                <template #icon><icon-undo /></template>{{ options.recovery.text || '恢复' }}</a-button>
            </a-popconfirm>

            <a-button
              v-if="options.import.show"
              v-auth="options.import.auth || []"
              v-role="options.import.role || []"
              @click="importAction"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><template #icon><icon-upload /></template>{{ options.import.text || '导入' }}</a-button>

            <a-button
              v-if="options.export.show"
              v-auth="options.export.auth || []"
              v-role="options.export.role || []"
              @click="exportAction"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><template #icon><icon-download /></template>{{ options.export.text || '导出' }}</a-button>

            <a-button
              type="secondary"
              @click="handlerExpand"
              v-if="options.isExpand"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            >
              <template #icon>
                <icon-expand v-if="! expandState" />
                <icon-shrink v-else />
              </template>
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
          <a-tooltip content="打印表格"><a-button shape="circle" @click="printTable"><icon-printer /></a-button></a-tooltip>
          <a-tooltip content="设置"><a-button shape="circle" @click="tableSetting"><icon-settings /></a-button></a-tooltip>
        </a-space>
      </div>
      <div ref="crudContentRef">
        <slot name="crudContent" v-bind="tableData">
          <a-table
            v-if="(! options.expandAllRows || tableData.length > 0) && tableIsShow"
            v-bind="$attrs"
            ref="tableRef"
            :key="options.pk"
            :data="tableData"
            :loading="loading"
            :sticky-header="options.stickyHeader"
            :pagination="options.tablePagination"
            :stripe="options.stripe"
            :bordered="options.bordered"
            :rowSelection="options.rowSelection ?? undefined"
            :row-key="options?.rowSelection?.key ?? options.pk"
            :scroll="options.scroll"
            :column-resizable="options.resizable"
            :size="options.size"
            :row-class="options.rowClass"
            :hide-expand-button-on-empty="options.hideExpandButtonOnEmpty"
            :default-expand-all-rows="options.expandAllRows"
            :summary="(options.customerSummary || options.showSummary) && __summary"
            @selection-change="setSelecteds"
            @sorter-change="handlerSort"
          >
              <template #tr="{ record }">
                <tr
                  class="ma-crud-table-tr"
                  :class="isFunction(options.rowCustomClass) ? options.rowCustomClass(record, rowIndex) ?? [] : options.rowCustomClass"
                  @contextmenu.prevent="openContextMenu($event, record)"
                  @dblclick="dbClickOpenEdit(record)"
                />
              </template>

              <template #expand-row="record" v-if="options.showExpandRow">
                <slot name="expand-row" v-bind="record"></slot>
              </template>
              <template #columns>
                <ma-column
                  ref="crudColumnRef"
                  v-if="reloadColumn"
                  :columns="columns"
                  :isRecovery="isRecovery"
                  :crudFormRef="crudFormRef"
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

                  <template v-for="slot in getTitleSlot(columns)" #[slot]="{ column }">
                    <slot :name="`${slot}`" v-bind="{ column }" />
                  </template>

                  <template
                    v-for="(slot, slotIndex) in getSlot(columns)"
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
    <div class="_crud-footer mt-3 text-right" ref="crudFooterRef" v-if="total > 0 && openPagination && !options.tablePagination">
      <a-pagination
        :total="total"
        show-total show-jumper show-page-size
        :page-size-options="options.pageSizeOption"
        @page-size-change="pageSizeChangeHandler"
        @change="pageChangeHandler"
        v-model:current="requestParams[config.request.page]"
        :page-size="requestParams[config.request.pageSize]"
        style="display: inline-flex"
      />
    </div>

    <ma-setting
      ref="crudSettingRef"
      @onChangeSearchHide="initSearchColumns()"
      @onChangeColumnHide="changeColumn"
    />

    <ma-form ref="crudFormRef" @success="requestSuccess">
      <template v-for="slot in Object.keys($slots)" #[slot]="component">
        <slot :name="slot" v-bind="component" />
      </template>
    </ma-form>

    <ma-import ref="crudImportRef" @success="refresh"/>

    <ma-context-menu ref="crudContextMenuRef" @execCommand="execContextMenuCommand" />

    <a-image-preview-group :srcList="imgUrl" v-model:visible="imgVisible" v-if="typeof imgUrl === 'object' && imgUrl !== null" />
    <a-image-preview :src="imgUrl" v-model:visible="imgVisible" v-else />
  </a-layout-content>
</template>

<script setup>
import config from '@/config/crud'
import { ref, watch, provide, nextTick, onMounted, onUnmounted } from 'vue'
import defaultOptions from './js/defaultOptions'
import { loadDict } from '@cps/ma-form/js/networkRequest.js'
import ColumnService from '@cps/ma-form/js/columnService'

import MaSearch from './components/search.vue'
import MaForm from './components/form.vue'
import MaSetting from './components/setting.vue'
import MaImport from './components/import.vue'
import MaColumn from './components/column.vue'
import MaContextMenu from './components/contextMenu.vue'
import checkAuth from '@/directives/auth/auth'
import checkRole from '@/directives/role/role'
import { Message } from '@arco-design/web-vue'
import { request } from '@/utils/request'
import tool from '@/utils/tool'
import Print from '@/utils/print'
import { isArray, isFunction, isObject, isUndefined } from 'lodash'
import { runEvent } from '@cps/ma-form/js/event.js'
import globalColumn from '@/config/column.js'
import { useFormStore } from '@/store/index'

const formStore = useFormStore()
const props = defineProps({
  // 表格数据
  data: { type: [ Function, Array ], default: () => null },
  // 增删改查设置
  options: { type: Object, default: {} },
  crud: { type: Object, default: {} },
  // 字段列设置
  columns: { type: Array, default: [] }
})

const loading = ref(true)
const dicts = ref({})
const cascaders = ref([])

const reloadColumn = ref(true)
const tableIsShow = ref(true)
const openPagination = ref(false)
const imgVisible = ref(false)
const imgUrl = ref(import.meta.env.VITE_APP_BASE + 'not-image.png')
const total = ref(0)
const requestParams = ref({})
const slots = ref([])
const searchSlots = ref([])
const isRecovery = ref(false)
const expandState = ref(false)

const crudHeaderRef = ref()
const crudOperationRef = ref()
const crudContentRef = ref()
const crudFooterRef = ref()
const crudSearchRef = ref()
const crudSettingRef = ref()
const crudFormRef = ref()
const crudImportRef = ref()
const crudColumnRef = ref()
const crudContextMenuRef = ref()

const options = ref(
  Object.assign(JSON.parse(JSON.stringify(defaultOptions)), props.options, props.crud)
)

const columns = ref(props.columns)
const headerHeight = ref(0)
const selecteds = ref([])
const tableData = ref([])
const tableRef = ref()
const currentApi = ref()

// 初始化
const init = async () => {

  // 设置 组件id
  if (isUndefined(options.value.id)) {
    options.value.id = 'MaCrud_' + Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
  }

  // 收集数据
  columns.value.map(item => {
    if (item.cascaderItem && item.cascaderItem.length > 0) {
      cascaders.value.push(...item.cascaderItem)
    }
  })

  await columns.value.map(async item => {
    // 字典
    if (! cascaders.value.includes(item.dataIndex) && item.dict) {
      await loadDict(dicts.value, item)
    }
  })
  setTimeout(async () => {
    await tabsHandler()
  }, 500)
}


const dictTrans = (dataIndex, value) => {
  if (dicts.value[dataIndex] && dicts.value[dataIndex].tran) {
    return dicts.value[dataIndex].tran[value]
  } else {
    return value
  }
}

const dictColors = (dataIndex, value) => {
  if (dicts.value[dataIndex] && dicts.value[dataIndex].colors) {
    return dicts.value[dataIndex].colors[value]
  } else {
    return undefined
  }
}

 // 公用模板
columns.value.map((item, index) => {
  if (item.common && globalColumn[item.dataIndex]) {
    columns.value[index] = globalColumn[item.dataIndex]
    item = columns.value[index]
  }
  !item.width && (item.width = options.value.columnWidth)
})

provide('options', options.value)
provide('requestParams', requestParams.value)
provide('columns', columns)
provide('dicts', dicts)
provide('layout', props.layout)
provide('dictTrans', dictTrans)
provide('dictColors', dictColors)
provide('isRecovery', isRecovery)

watch(
  () => props.options.api,
  vl => options.value.api = vl
)

watch(
  () => props.crud.api,
  vl => options.value.api = vl
)

watch([
  () => openPagination.value,
  () => total.value
], () => options.value.pageLayout === 'fixed' && settingFixedPage() )


watch(
    () => formStore.crudList[options.value.id],
    async vl => {
      vl === true && await requestData()
      formStore.crudList[options.value.id] = false
    }
)

const showImage = (url) => {
  imgUrl.value = url
  imgVisible.value = true
}

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

const getTitleSlot = (cls = []) => {
  let sls = []
  cls.map(item => {
    if (item.children && item.children.length > 0) {
      let tmp = getTitleSlot(item.children)
      sls.push(...tmp)
    } else if (item.dataIndex) {
      sls.push(`tableTitle-${item.dataIndex}`)
    }
  })
  return sls
}

const getSearchSlot = () => {
  let sls = []
  columns.value.map(item => {
    if (item.search && item.search === true) {
      sls.push(item.dataIndex)
    }
  })
  return sls
}

const requestData = async () => {
  await init()
  if (options.value.showIndex && columns.value.length > 0 && columns.value[0].dataIndex !== '__index') {
    columns.value.unshift({
      title: options.value.indexLabel, dataIndex: '__index',
      width: options.value.indexColumnWidth, fixed: options.value.indexColumnFixed
    })
  }
  if (options.value.operationColumn && columns.value.length > 0 && columns.value[columns.value.length - 1].dataIndex !== '__operation') {
    columns.value.push({
      title: options.value.operationColumnText, dataIndex: '__operation',
      width: options.value.operationColumnWidth ?? options.value.operationWidth,
      align: options.value.operationColumnAlign, fixed: options.value.operationColumnFixed
    })
  }

  initRequestParams()
  if (! options.value.tabs?.dataIndex && ! options.value.tabs.data) {
    await refresh()
  } else {
    options.value.tabs.defaultKey = options.value.tabs?.defaultKey ?? options.value.tabs.data[0].value
    await tabChange(options.value.tabs?.defaultKey)
  }
}

const initRequestParams = () => {
  requestParams.value[config.request.page] = 1
  requestParams.value[config.request.pageSize] = options.value.pageSize ?? 10
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
      } else {
        openPagination.value = false
      }
    } else {
      tableData.value = response
    }
  } else {
    console.error(`ma-crud error：crud.api not is Function.`)
  }
  isFunction(options.value.afterRequest) && (tableData.value = options.value.afterRequest(tableData.value))
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
  tableRef.value.selectAll(false)
}

const searchSubmitHandler = async (formData) => {
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
  await pageChangeHandler(1)
  if (options.value.afterSearch && isFunction(options.value.afterSearch)) {
    options.value.afterSearch(requestParams.value)
  }
}

const pageSizeChangeHandler = async (pageSize) => {
  requestParams.value[config.request.page] = 1
  requestParams.value[config.request.pageSize] = pageSize
  await refresh()
}

const pageChangeHandler = async (currentPage) => {
  requestParams.value[config.request.page] = currentPage
  await refresh()
}

const toggleSearch = async () => {
  const dom = crudHeaderRef.value?.style
  if (dom) {
    crudSearchRef.value.showSearch
    ? crudSearchRef.value.setSearchHidden()
    : crudSearchRef.value.setSearchDisplay()

    await nextTick(() => {
      headerHeight.value = crudHeaderRef.value.offsetHeight
      options.value.pageLayout === 'fixed' && settingFixedPage()
    })
  }
}

const settingFixedPage = () => {
  const workAreaHeight = document.querySelector('.work-area').offsetHeight
  const tableHeight = workAreaHeight - headerHeight.value - (openPagination.value ? 160 : 116) + (total.value === 0 && !loading.value ?  44: 0)
  crudContentRef.value.style.height = tableHeight + 'px'
}

const tableSetting = () => {
  crudSettingRef.value.open()
}

const requestSuccess = async response => {
  if (response && response.code && response.code === 200) {
    options.value.dataCompleteRefresh && await refresh()
    if (reloadColumn.value) {
      reloadColumn.value = false
      await nextTick(() => {
        reloadColumn.value = true
      })
    }
  }
}

const addAction = () => {
  if (isFunction(options.value.beforeOpenAdd) && ! options.value.beforeOpenAdd()) {
    return false
  }
  if (options.value.add.action && isFunction(options.value.add.action)) {
    options.value.add.action()
  } else {
    crudFormRef.value.add()
  }
}

const editAction = (record) => {
  if (isFunction(options.value.beforeOpenEdit) && ! options.value.beforeOpenEdit(record)) {
    return false
  }
  if (options.value.edit.action && isFunction(options.value.edit.action)) {
    options.value.edit.action(record)
  } else {
    crudFormRef.value.edit(record)
  }
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

      if (options.value.edit.api && options.value.edit.show && isFunction(options.value.edit.api)) {
        editAction(record)
      }
    }
  }
}

const importAction = () => crudImportRef.value.open()

const exportAction = () => {
  Message.info('请求服务器下载文件中...')
  const data = options.value.requestParamsLabel ? requestParams.value[options.value.requestParamsLabel] : requestParams.value
  const download = (url) => request({ url, data, method: 'post', timeout: 60 * 1000, responseType: 'blob' })

  download(options.value.export.url).then(res => {
    tool.download(res)
    Message.success('请求成功，文件开始下载')
  }).catch(() => {
    Message.error('请求服务器错误，下载失败')
  })
}

const deletesMultipleAction = async () => {
  if (selecteds.value && selecteds.value.length > 0) {
    const api = isRecovery.value ? options.value.delete.realApi : options.value.delete.api
    let data = {}
    if (isFunction(options.value.beforeDelete) && !( data = options.value.beforeDelete(selecteds.value)) ) {
      return false
    }
    const response = await api(Object.assign( { ids: selecteds.value }, data ))
    if (options.value.afterDelete && isFunction(options.value.afterDelete)) {
      options.value.afterDelete(response)
    }
    response.success && Message.success(response.message || `删除成功！`)
    selecteds.value = []
    await refresh()
  } else {
    Message.error('至少选择一条数据')
  }
}

const recoverysMultipleAction = async () => {
  if (selecteds.value && selecteds.value.length > 0) {
    const response = await options.value.recovery.api({ ids: selecteds.value })
    response.success && Message.success(response.message || `恢复成功！`)
    selecteds.value = []
    await refresh()
  } else {
    Message.error('至少选择一条数据')
  }
}

const setSelecteds = (key) => {
  selecteds.value = key
}

const switchDataType = async () => {
  isRecovery.value = ! isRecovery.value
  currentApi.value = isRecovery.value && options.value.recycleApi && isFunction(options.value.recycleApi)
    ? options.value.recycleApi
    : options.value.api
  await requestData()
}

const handlerExpand = () => {
  expandState.value = ! expandState.value
  expandState.value ? tableRef.value.expandAll(true) : tableRef.value.expandAll(false)
}

const handlerSort = async (name, type) => {
  const col = columns.value.find(item => name === item.dataIndex)
  if (col.sortable && col.sortable.sorter) {
    if (type) {
      requestParams.value.orderBy = name
      requestParams.value.orderType = type === 'ascend' ? 'asc' : 'desc'
    } else {
      requestParams.value.orderBy = undefined
      requestParams.value.orderType = undefined
    }
    await refresh()
  }
}

const getTableData = () => {
  return tableData.value
}

const __summary = ({ data }) => {
  if (options.value.showSummary && isArray(options.value.summary)) {
    const summary = options.value.summary
    let summaryData = {}
    let summaryPrefixText = {}
    let summarySuffixText = {}
    let length = data.length || 0
    summary.map( item => {
      if (item.action && item.action === 'text') {
        summaryData[item.dataIndex] = item.content
      } else {
        summaryData[item.dataIndex] = 0
        summaryPrefixText[item.dataIndex] = item?.prefixText ?? ''
        summarySuffixText[item.dataIndex] = item?.suffixText ?? ''
        data.map(record => {
          if (record[item.dataIndex]) {
            if (item.action && item.action === 'sum') {
              summaryData[item.dataIndex] += parseFloat(record[item.dataIndex])
            }
            if (item.action && item.action === 'avg') {
              summaryData[item.dataIndex] += parseFloat(record[item.dataIndex]) / length
            }
          }
        })
      }
    })

    for (let i in summaryData) {
      if (/^\d+(\.\d+)?$/.test(summaryData[i])) {
        summaryData[i] = summaryPrefixText[i] + tool.groupSeparator(summaryData[i].toFixed(2)) + summarySuffixText[i]
      }
    }

    return [ summaryData ]
  }
}

const resizeHandler = () => {
  headerHeight.value = crudHeaderRef.value.offsetHeight
  settingFixedPage()
}

const tabChange = async (value) => {
  const searchKey = options.value.tabs?.searchKey ?? options.value.tabs?.dataIndex ?? 'tabValue'
  const params = {}
  params[searchKey] = value
  requestParams.value = Object.assign(requestParams.value, params)
  await runEvent(options.value.tabs, 'onChange', undefined, value)
  await refresh()
}

const printTable = () => {
  new Print(crudContentRef.value)
}

const openContextMenu = (ev, record) => {
  ( options.value?.contextMenu?.enabled === true ) && crudContextMenuRef.value.openContextMenu(ev, record)
}

const execContextMenuCommand = async (args) => {
  const item = args.contextItem
  const record = args.record
  switch(item.operation) {
    case 'print': await printTable(); break;
    case 'refresh': await refresh(); break;
    case 'add': addAction(); break;
    case 'edit': editAction(record); break;
    case 'delete': crudColumnRef.value.deleteAction(record); break;
    default:
      await runEvent(item, 'onCommand', undefined, args)
      break;
  }
}

const tabsHandler = async () => {
    // 处理tabs
    const tabs = options.value.tabs
    if ( isFunction(tabs.data) || isArray(tabs.data) ) {
        tabs.data = isFunction(tabs.data) ? await tabs.data() : tabs.data
    } else if (! isUndefined(tabs.dataIndex) ) {
        const col = columns.value.find( item => item.dataIndex === tabs.dataIndex )
        if ( col.search === true && isObject(col.dict) ) {
            tabs.data = dicts.value[tabs.dataIndex]
        }
    }
}

const isBatch = (obj) => isUndefined(obj) ? true : (obj?.batch ?? true)

const changeColumn = async () => {
  tableIsShow.value = false
  await nextTick(() => tableIsShow.value = true)
}

onMounted(async() => {
  if (! options.value.expandSearch && crudSearchRef.value) {
    crudSearchRef.value.setSearchHidden()
  }
  if (options.value.pageLayout === 'fixed') {
    await nextTick(() => {
      window.addEventListener('resize', resizeHandler, false);
      headerHeight.value = crudHeaderRef.value.offsetHeight
      settingFixedPage()
    })
  }
  if (typeof options.value.autoRequest == 'undefined' || options.value.autoRequest) {
    await requestData()
  }
})

onUnmounted(() => {
  if (options.value.pageLayout === 'fixed') {
    window.removeEventListener('resize', resizeHandler, false);
  }
})

const getCurrentAction = () => crudFormRef.value.currentAction
const getFormData = () => crudFormRef.value.form

const getFormColumns = async (type = 'add') => {
  return await crudFormRef.value.getFormColumns(type)
}

const getCurrentPage = () => requestParams.value[config.request.page]
const getPageSize = () => requestParams.value[config.request.pageSize]
const getTotal = () => total.value
const initSearchColumns = () => crudSearchRef.value.initSearchColumns()

/**
 * 获取column属性服务类
 * @returns ColumnService
 */
const getColumnService = (strictMode = true) => {
  return new ColumnService({ columns: columns.value, cascaders: cascaders.value, dicts: dicts.value }, strictMode )
}

defineExpose({
  refresh, requestData, addAction, editAction, getTableData, setSelecteds,
  getCurrentAction, getFormData, getFormColumns, getColumnService, getCurrentPage, getPageSize, getTotal,
  requestParams, isRecovery, tableRef, initSearchColumns,
  crudFormRef, crudSearchRef, crudImportRef, crudSettingRef
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
