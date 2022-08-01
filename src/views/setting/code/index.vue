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
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
      <!-- 操作前置扩展 -->
      <template #tableButtons>
        <a-button
          v-auth="['setting:code:generate']"
          type="outline"
        ><icon-code /> 生成代码</a-button>
        <a-button
          @click="() => loadTableRef.open()"
          v-auth="['setting:code:loadTable']"
          type="outline"
          status="success"
        ><icon-export /> 装载数据表</a-button>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend>
        <a-link><icon-eye /> 预览</a-link>
        <a-link><icon-sync /> 同步</a-link>
        <a-link><icon-edit /> 编辑</a-link>
        <a-link><icon-code /> 生成代码</a-link>
      </template>
    </ma-crud>

    <load-table ref="loadTableRef" @success="selectSuccess" />
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import generate from '@/api/setting/generate'
  import { Message } from '@arco-design/web-vue'

  import LoadTable from './components/loadTable.vue'

  const crudRef = ref()
  const loadTableRef = ref()

  const types = [
    { label: '单表CRUD', code: 'single' },
    { label: '树表CRUD', code: 'tree' },
  ]

  const selectSuccess = (result) => {
    result && crudRef.value.refresh()
  }

  const crud = reactive({
    api: generate.getPageList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 270,
    delete: {
      show: true,
      api: generate.deletes, auth: ['setting:code:delete'],
    },
  })

  const columns = reactive([
    { title: '表名称', dataIndex: 'table_name', search: true, width: 200 },
    { title: '表描述', dataIndex: 'table_comment', width: 400 },
    {
      title: '生成类型', dataIndex: 'type', formType: 'select', width: 120,
      dict: { data: types, translation: true },
    },
    { title: '创建时间', dataIndex: 'created_at', width: 160 },
  ])
</script>

<script>
export default { name: 'setting:code' }
</script>

<style scoped>

</style>