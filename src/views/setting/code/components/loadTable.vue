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
  <a-modal width="1000px" v-model:visible="visible" :on-before-ok="loadTable" :align-center="false" top="50px">
    <template #title>装载数据表</template>
    <!-- CRUD 组件 -->
    <ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="handlerSelection"></ma-crud>
  </a-modal>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import dataMaintain from '@/api/system/dataMaintain'
  import generate from '@/api/setting/generate'
  import { Message } from '@arco-design/web-vue'

  const crudRef = ref()
  const selecteds = ref([])
  const visible = ref(false)
  const emit = defineEmits(['success'])

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
    crudRef.value.requestData()
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
    { title: '表注释', dataIndex: 'comment', width: 180 },
    { title: '创建时间', dataIndex: 'create_time', width: 180 },
  ])

  defineExpose({ open })
</script>