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
    <div class="_crud-header flex flex-col mb-2" ref="crudHeader">
      <ma-search
        :columns="settingProps.columns"
        :search-label-width="settingProps.crud.searchLabelWidth"
        :search-label-align="settingProps.crud.searchLabelAlign"
        :search-label-cols="settingProps.crud.searchLabelCols"
        :search-col="settingProps.crud.searchCol"
        @search="searchHandler"
        class="__search-panel"
        ref="maCrudSearch"
      >
        <template #searchButtons>
          <slot name="searchButtons"></slot>
        </template>
      </ma-search>
    </div>
    <div class="_crud-content">
      <div class="opartion-tools lg:flex justify-between mb-3">
        <a-space class="lg:flex block lg:inline-block" >

          <a-button
            v-if="
              defaultCrud.add.show
              && ($common.auth(defaultCrud.add.auth || [])
              || (defaultCrud.add.role || []))
            "
            @click="addAction" type="primary"
            class="w-full lg:w-auto mt-2 lg:mt-0"
          ><icon-plus /> {{ defaultCrud.add.text || '新增' }}</a-button>

          <a-popconfirm
            content="确定要删除数据吗?"
            position="bottom"
            @ok="deletesMultipleAction"
            v-if="
              defaultCrud.delete.show
              && ($common.auth(defaultCrud.delete.auth || [])
              || (defaultCrud.delete.role || []))
            "
          >
            <a-button
              type="primary" status="danger"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><icon-delete /> {{ isRecovery ? defaultCrud.delete.realText || '删除' : defaultCrud.delete.text || '删除' }}</a-button>
          </a-popconfirm>

          <a-popconfirm
            content="确定要恢复数据吗?"
            position="bottom"
            @ok="recoverysMultipleAction"
            v-if="
              defaultCrud.recovery.show
              && isRecovery
              && ($common.auth(defaultCrud.recovery.auth || [])
              || (defaultCrud.recovery.role || []))
            "
          >
            <a-button
              type="primary" status="success"
              class="w-full lg:w-auto mt-2 lg:mt-0"
            ><icon-undo /> {{ defaultCrud.recovery.text || '恢复' }}</a-button>
          </a-popconfirm>

          <a-button
            v-if="
              defaultCrud.import.show
              && ($common.auth(defaultCrud.import.auth || [])
              || (defaultCrud.import.role || []))
            "
            @click="importAction"
            class="w-full lg:w-auto mt-2 lg:mt-0"
          ><icon-upload /> {{ defaultCrud.import.text || '导入' }}</a-button>

          <a-button
            v-if="
              defaultCrud.export.show
              && ($common.auth(defaultCrud.export.auth || [])
              || (defaultCrud.export.role || []))
            "
            @click="exportAction"
            class="w-full lg:w-auto mt-2 lg:mt-0"
          ><icon-download /> {{ defaultCrud.export.text || '导出' }}</a-button>

          <a-button
            type="secondary"
            @click="handlerExpand"
            v-if="defaultCrud.isExpand"
            class="w-full lg:w-auto mt-2 lg:mt-0"
          >
            <icon-expand v-if="! expandState" />
            <icon-shrink v-else />
            {{ expandState ? ' 折叠' : ' 展开' }}
          </a-button>
          <slot name="tableButtons"></slot>
        </a-space>
        <a-space class="lg:mt-0 mt-2" v-if="defaultCrud.showTools">
          <slot name="tools"></slot>
          <a-tooltip
            :content="isRecovery ? '显示正常数据' : '显示回收站数据'"
            v-if="defaultCrud.recycleApi && isFunction(defaultCrud.recycleApi)"
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
      <slot name="content" v-bind="tableData">
        <a-table
          v-bind="$attrs"
          ref="tableRef"
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
          :summary="defaultCrud.customerSummary || __summary || defaultCrud.showSummary"
          @selection-change="setSelecteds"
          @sorter-change="handlerSort"
        >
          <template #tr="{ record }">
            <tr class="ma-crud-table-tr" @dblclick="dbClickOpenEdit(record)" />
          </template>

          <template #expand-row="record" v-if="defaultCrud.showExpandRow">
            <slot name="expand-row" v-bind="record"></slot>
          </template>
          <template #columns>
            <ma-column
              :options="defaultCrud"
              :columns="columns"
              :searchRef="maCrudSearch"
              :formRef="maCrudForm"
              :isRecovery="isRecovery"
              :params="requestParams"
              @refresh="() => refresh()"
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
          <template #summary-cell="{ column, record, rowIndex }" v-if="defaultCrud.customerSummary || defaultCrud.showSummary">
            <slot name="summary-cell" v-bind="{ record, column, rowIndex }">{{ record[column.dataIndex] }}</slot>
          </template>
        </a-table>
      </slot>
    </div>
    <div class="_crud-footer mt-3 text-right">
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

    <ma-setting
      ref="maCrudSetting"
      v-model="columns"
      v-model:crud="defaultCrud"
    />

    <ma-form
      ref="maCrudForm"
      v-model="columns"
      v-model:crud="defaultCrud"
      @success="requestSuccess"
    />

    <ma-import
      ref="maCrudImport"
      v-model="defaultCrud.import"
    />

  </a-layout-content>
</template>

<script setup>
import config from '@/config/crud'
import { isFunction } from '@vue/shared'
import { ref, watch, nextTick, onMounted } from 'vue'

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
import _ from 'lodash'

const loading = ref(true)
const openPagination = ref(false)
const pageSizeOption = ref([10, 20, 30, 50, 100])
const total = ref(0)
const requestParams = ref({})
const columns = ref([])
const slots = ref([])
const showSearch = ref(true)
const isRecovery = ref(false)
const expandState = ref(false)
const crudHeader = ref(null)
const selecteds = ref([])

const tableData = ref([])
const tableRef = ref()
const currentApi = ref()

const maCrudSearch = ref(null)
const maCrudSetting = ref(null)
const maCrudForm = ref(null)
const maCrudImport = ref(null)

const defaultCrud = ref({
  // 主键名称
  pk: 'id',
  // 设置选择列
  rowSelection: undefined,
  // 是否显示边框
  bordered: { wrapper: true, cell: false },
  // 是否开启拖拽排序
  dragSort: false,
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
  // 是否开启双击编辑数据
  isDbClickEdit: true,
  // 是否显示展开/折叠按钮
  isExpand: false,
  // 是否显示自定义
  showExpandRow: false,
  // 是否显示总结行
  showSummary: false,
  // 自定义总结行，要传入函数
  customerSummary: false,
  // 是否显示工具栏
  showTools: true,
  // 新增和编辑显示设置
  viewLayoutSetting: {
    // 布局方式, 支持 auto（自动） 和 customer（自定义）两种
    layout: 'auto',
    // 显示方式支持模态框和抽屉: modal drawer
    viewType: 'modal',
    // 显示宽度
    width: 600,
    // 是否全屏，只有modal有效
    isFull: false,
    // 表单设置一行多少列，会自适应，在布局为 auto 下生效
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

    // 真实删除api
    realApi: undefined,
    // 显示真实删除按钮的权限
    realAuth: [],
    // 显示真实删除按钮的角色
    realRole: [],
    // 真实按钮文案
    realText: '删除',

    // 是否显示
    show: false,
  },
  recovery: {
    // 显示恢复按钮的权限
    auth: [],
    // 显示恢复按钮的角色
    role: [],
    // 按钮文案
    text: '恢复',
    // 是否显示
    show: false,
  },
  // see: {
  //   // 显示查看按钮的权限
  //   auth: [],
  //   // 显示查看按钮的角色
  //   role: [],
  //   // 按钮文案
  //   text: '查看',
  //   // 是否显示
  //   show: false,
  // },
  import: {
    // 导入url
    url: undefined,
    // 下载模板地址
    templateUrl: undefined,
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
  operationWidth: 160,
  // 操作列名称
  operationColumnText: '操作',
})

watch(() => settingProps.pageSizeOption, (val) => {
  pageSizeOption.value = val
})

watch(() => settingProps.crud.requestParams, (val) => {
  requestParams.value = val
}, { deep: true })

watch(() => settingProps.columns, () => {
  requestData()
})

watch(() => settingProps.api, () => {
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

slots.value = getSlot(settingProps.columns)

const requestData = async () => {
  defaultCrud.value = Object.assign(defaultCrud.value, settingProps.crud)
  columns.value = Object.assign(settingProps.columns, {})
  if (defaultCrud.value.showIndex && columns.value.length > 0 && columns.value[0].dataIndex !== '__index') {
    columns.value.unshift({ title: defaultCrud.value.indexLabel, dataIndex: '__index', width: 70, fixed: 'left' })
  }
  if (defaultCrud.value.operationColumn && columns.value.length > 0 && columns.value[columns.value.length - 1].dataIndex !== '__operation') {
    columns.value.push({ title: defaultCrud.value.operationColumnText, dataIndex: '__operation', width: defaultCrud.value.operationWidth, align: 'right', fixed: 'right' })
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

  isFunction(settingProps.crud.beforeRequest) && settingProps.crud.beforeRequest(requestParams.value)

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

  isFunction(settingProps.crud.afterRequest) && settingProps.crud.afterRequest(tableData.value)

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
  } else {
    currentApi.value = isRecovery.value && defaultCrud.value.recycleApi && isFunction(defaultCrud.value.recycleApi)
    ? defaultCrud.value.recycleApi
    : defaultCrud.value.api
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
  if (settingProps.crud.beforeSearch && isFunction(settingProps.crud.beforeSearch)) {
    settingProps.crud.beforeSearch(requestParams.value)
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
  const dom = crudHeader.value.style
  dom.display = showSearch.value ? 'none' : 'block'
  showSearch.value = ! showSearch.value
}

const tableSetting = () => {
  maCrudSetting.value.open()
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

const addAction = () => {
  isFunction(defaultCrud.value.beforeOpenAdd) && defaultCrud.value.beforeOpenAdd()
  maCrudForm.value.add()
}

const editAction = (record) => {
  isFunction(defaultCrud.value.beforeOpenEdit) && defaultCrud.value.beforeOpenEdit(record)
  maCrudForm.value.edit(record)
}

const dbClickOpenEdit = (record) => {
  if (defaultCrud.value.isDbClickEdit) {
    if (isRecovery.value) {
      Message.error('回收站数据不可编辑')
      return
    }

    if (! checkAuth(defaultCrud.value.edit.auth || [])) {
      Message.error('没有编辑数据的权限')
      return
    }

    if (defaultCrud.value.edit.api && isFunction(defaultCrud.value.edit.api)) {
      editAction(record)
    }
  }
}

const importAction = () => maCrudImport.value.open()

const exportAction = () => {
  Message.info('请求服务器下载文件中...')
  const data = settingProps.crud.requestParamsLabel ? requestParams.value[settingProps.crud.requestParamsLabel] : requestParams.value
  const download = (url) => request({ url, data, method: 'post', timeout: 60 * 1000, responseType: 'blob' })

  download(defaultCrud.value.export.url).then(res => {
    tool.download(res)
    Message.success('请求成功，文件开始下载')
  }).catch(e => {
    Message.error('请求服务器错误，下载失败')
  })
}

const deletesMultipleAction = async () => {
  if (selecteds.value && selecteds.value.length > 0) {
    const api = isRecovery.value ? defaultCrud.value.delete.realApi : defaultCrud.value.delete.api
    const response = await api({ ids: selecteds.value })
    response.code === 200
    ? Message.success(response.message || `删除成功！`)
    : Message.error(response.message || `删除失败！`)
    refresh()
  } else {
    Message.error('至少选择一条数据')
  }
}

const recoverysMultipleAction = async() => {
  if (selecteds.value && selecteds.value.length > 0) {
    const response = await defaultCrud.value.recovery.api({ ids: selecteds.value })
    response.code === 200
    ? Message.success(response.message || `恢复成功！`)
    : Message.error(response.message || `恢复失败！`)
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
  currentApi.value = isRecovery.value && defaultCrud.value.recycleApi && isFunction(defaultCrud.value.recycleApi)
    ? defaultCrud.value.recycleApi
    : defaultCrud.value.api
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
  if (defaultCrud.value.showSummary && isArray(defaultCrud.value.summary)) {
    const summary = defaultCrud.value.summary
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
        // 请求回收站api方法
        recycleApi: undefined,
        // 请求前置处理
        beforeRequest: () => {},
        // 请求后置处理
        afterRequest: () => {},
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

onMounted(() => document.querySelector('.arco-table-body').className += ' customer-scrollbar' )

defineExpose({
  refresh, requestData, addAction, editAction, getTableData, setSelecteds,
  requestParams, isRecovery, tableRef,
  maCrudForm, maCrudSearch, maCrudImport, maCrudSetting
})

</script>

<style scoped lang="less">
.__search-panel {
  transition: display 1s; overflow: hidden;
}
._crud-footer {
  z-index: 10;
}
</style>
