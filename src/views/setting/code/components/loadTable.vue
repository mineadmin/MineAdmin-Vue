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
  <a-modal width="1100px" v-model:visible="visible" :on-before-ok="loadTable" :align-center="false" top="50px" unmount-on-close>
    <template #title>装载数据表</template>
    <a-alert class="mb-3" closable>非系统数据源，载入表时，建议重新命名表名称和表注释</a-alert>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="handlerSelection">
      <template #tableButtons>
        <a-input-group>
          <a-select placeholder="切换数据源" v-model="sourceName" :options="dataSourceList" style="width: 300px;"></a-select>
          <a-button type="primary" @click="switchSource">确定切换</a-button>
        </a-input-group>
      </template>

      <template #new_name="{ record }">
        <a-input @change="" v-model:default-value="record.name" />
      </template>
      <template #new_comment="{ record }">
        <a-input v-model:default-value="record.comment" />
      </template>
    </ma-crud>
  </a-modal>
</template>

<script setup>
  import { ref, reactive, nextTick } from 'vue'
  import dataMaintain from '@/api/system/dataMaintain'
  import dataSource from '@/api/setting/datasource'
  import generate from '@/api/setting/generate'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()
  const selecteds = ref([])
  const visible = ref(false)
  const sourceName = ref('MineAdmin')
  const newData = ref({})
  const newComment = ref({})
  const emit = defineEmits(['success'])

  const dataSourceList = ref([])

  generate.getDataSourceList().then(res => {
    dataSourceList.value = res.data.items
    dataSourceList.value.unshift({
      label: '系统数据源',
      value: 'MineAdmin'
    })
  })

  const switchSource = () => {
    const newNameColumn = columns.find(item => item.dataIndex === 'new_name')
    const newCommentColumn = columns.find(item => item.dataIndex === 'new_comment')
    if (sourceName.value === 'MineAdmin') {
      newNameColumn.hide = true
      newCommentColumn.hide = true
    } else {
      newNameColumn.hide = false
      newCommentColumn.hide = false
    }
    crud.api = sourceName.value === 'MineAdmin' ? dataMaintain.getPageList : dataSource.getDataSourceTablePageList
    crudRef.value.requestParams['id'] = sourceName.value === 'MineAdmin' ? undefined : sourceName.value
    crudRef.value.requestData()
  }

  const loadTable = async (done) => {
    if (selecteds.value.length < 1) {
      Message.info('至少要选择一条数据')
      done(false)
      return
    }
    let names = []
    crudRef.value.getTableData().filter(item => {
      if (selecteds.value.includes(item.name)) {
        names.push( { name: item.name, comment: item.comment } )
      }
    })
    const response = await generate.loadTable({ names })
    emit('success', response.success)
    selecteds.value = []
    done(true)
  }

  const handlerSelection = (name) => selecteds.value = name

  const open = () => {
    visible.value = true
    nextTick(() => {
      crudRef.value.requestData()
    })
  }

  const crud = reactive({
    pk: 'name',
    autoRequest: false,
    searchColNumber: 1,
    api: dataMaintain.getPageList,
    showIndex: true,
    rowSelection: { showCheckedAll: true, key: 'name', onlyCurrent: true },
  })

  const columns = reactive([
    { title: '表名称', dataIndex: 'name', search: true, width: 200 },
    { title: '新名称', dataIndex: 'new_name', hide: true, width: 200 },
    { title: '表注释', dataIndex: 'comment', width: 180 },
    { title: '新注释', dataIndex: 'new_comment', hide: true, width: 180 },
    { title: '创建时间', dataIndex: 'create_time', width: 180 },
  ])

  defineExpose({ open })
</script>