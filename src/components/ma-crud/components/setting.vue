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
  <a-drawer :visible="visible" unmountOnClose :footer="false" :width="900" @cancel="onCancel" >

    <template #title>设置</template>

    <a-space class="mt-3">
      <span>表格大小：</span>
      <a-radio-group type="button" v-model="options.size">
        <a-radio value="mini">迷你</a-radio>
        <a-radio value="small">小</a-radio>
        <a-radio value="medium">中</a-radio>
        <a-radio value="large">大</a-radio>
      </a-radio-group>
      <span class="ml-3">表格边框：</span>
      <a-radio-group type="button" v-model="bordered" @change="changeBordered">
        <a-radio value="hide">不显示外边框</a-radio>
        <a-radio value="show">全部显示</a-radio>
        <a-radio value="row">不显示行</a-radio>
        <a-radio value="column">不显示列</a-radio>
      </a-radio-group>
      <a-checkbox v-model="options.stripe" class="ml-3">斑马纹</a-checkbox>
    </a-space>

    <a-alert type="warning" class="mt-2">排序：本页是指当前页排序；服务器是指后台排序，若自定义服务器排序可用 <a-tag>@sorterChange</a-tag> 事件来实现</a-alert>
    <a-table
      :data="columns"
      :pagination="false"
      :bordered="{ wrapper: true, cell: false }"
      :draggable="{ type: 'handle', width: 40 }"
      @change="onTableChange"
      stripe
      class="mt-3"
    >
      <template #columns>
        <a-table-column title="列名称" data-index="title" align="center">
          <template #cell="{ record }">{{ record.title }}</template>
        </a-table-column>
        <a-table-column title="宽度" data-index="width" align="center">
          <template #cell="{ record }">
              <a-input-number
                v-if="! ['__index', '__operation'].includes(record.dataIndex)"
                style="width: 150px;"
                placeholder="列宽度"
                v-model="record.width"
                mode="button"
                @change="changeColumn($event, 'width', record.dataIndex)"
              />
              <span v-else> / </span>
          </template>
        </a-table-column>
        <a-table-column title="隐藏" data-index="hide" align="center">
          <template #cell="{ record }"><a-checkbox v-model="record.hide" @change="changeColumn($event, 'hide', record.dataIndex)" /></template>
        </a-table-column>
        <a-table-column title="固定" data-index="fixed" align="center">
          <template #cell="{ record }">
            <a-space v-if="! ['__index', '__operation'].includes(record.dataIndex)">
              <a-radio v-model="record.fixed" value="" @change="changeColumn($event, 'fixed', record.dataIndex)">无</a-radio>
              <a-radio v-model="record.fixed" value="left" @change="changeColumn($event, 'fixed', record.dataIndex)">左</a-radio>
              <a-radio v-model="record.fixed" value="right" @change="changeColumn($event, 'fixed', record.dataIndex)">右</a-radio>
            </a-space>
            <span v-else> / </span>
          </template>
        </a-table-column>
        <a-table-column title="排序" data-index="order" align="center">
          <template #cell="{ record }">
            <a-space v-if="! ['__index', '__operation'].includes(record.dataIndex)" >
              <a-radio v-model="record.__order" value="" @change="changeColumn($event, 'order', record.dataIndex)">无</a-radio>
              <a-radio v-model="record.__order" value="page" @change="changeColumn($event, 'order', record.dataIndex)">本页</a-radio>
              <a-radio v-model="record.__order" value="serve" @change="changeColumn($event, 'order', record.dataIndex)">服务器</a-radio>
            </a-space>
            <span v-else> / </span>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-drawer>
</template>

<script setup>
import { ref, watch, inject } from 'vue'

const options = inject('options')
let columns = inject('columns')

const visible = ref(false)
const tableWidth = ref('100%')
const bordered = ref('column')

const open = () => {
  visible.value = true
}

const onCancel = () => {
  visible.value = false
}

const changeColumn = (ev, type, name) => {
  const column = columns.find( item =>  item.dataIndex === name )
  switch (type) {
    case 'order':
      if (ev === 'page') {
        column.sortable = { sortDirections: ['ascend', 'descend'], sorter: false }
      } else if (ev === 'serve') {
        column.sortable = { sortDirections: ['ascend', 'descend'], sorter: true }
      } else {
        column.sortable = undefined
      }
      break
  }
}

const changeBordered = (v) => {
  if (v === 'hide') {
    options.bordered = { wrapper: false, cell: false }
  }
  if (v === 'show') {
    options.bordered = { wrapper: true, cell: true }
  }
  if (v === 'row') {
    options.bordered = { wrapper: false, cell: true }
  }
  if (v === 'column') {
    options.bordered = { wrapper: true, cell: false }
  }
}

const onTableChange = (_data) => {
  columns = _data
}

defineExpose({ open })
</script>