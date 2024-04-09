<template>
  <a-drawer :visible="visible" unmountOnClose :footer="false" :width="600" @cancel="onCancel" >

    <template #title>筛选项</template>
    <a-table
      :data="allowShowColumns"
      :pagination="false"
      :bordered="{ wrapper: true, cell: false }"
      stripe
      class="mt-3"
    >
      <template #columns>
        <a-table-column title="列名称" data-index="title" align="center">
          <template #cell="{ record }">{{ record.title }}</template>
        </a-table-column>
        <a-table-column title="显示" data-index="hide" align="center">
          <template #cell="{ record }"><a-switch v-model="record.search" @change="changeColumn($event,
          record.dataIndex)" /></template>
        </a-table-column>
      </template>
    </a-table>
  </a-drawer>
</template>

<script setup>
import { ref, inject } from 'vue'

const options = inject('options')
const columns = inject('columns')
const allowShowColumns = ref([])

const emit = defineEmits([ 'onChange' ])


const setShowColumns = () => {
  allowShowColumns.value = columns.value.filter(item => {
    return ! (item?.settingHide ?? false)
  })
}

const visible = ref(false)
const bordered = ref('column')

const open = () => {
  setShowColumns()
  visible.value = true
}

const onCancel = () => {
  visible.value = false
}

const changeColumn = (ev, name) => {
  emit('onChange', { dataIndex: name, value: ev })
}

defineExpose({ open })
</script>
