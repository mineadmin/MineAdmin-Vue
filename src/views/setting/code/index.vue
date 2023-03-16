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
    <ma-crud :options="crud" :columns="columns" ref="crudRef" @selection-change="selectionChange">
      <!-- 表格按钮后置扩展 -->
      <template #tableAfterButtons>
        <a-button
          v-auth="['setting:code:generate']"
          type="outline"
          @click="batchGenerate"
        ><template #icon><icon-code /></template>生成代码</a-button>
        <a-button
          v-auth="['setting:code:loadTable']"
          @click="() => loadTableRef.open()"
          type="outline"
          status="success"
        ><template #icon><icon-export /></template>装载数据表</a-button>
      </template>
      <!-- 操作前置扩展 -->
      <template #operationBeforeExtend="{ record }">
        <a-link
          v-auth="['setting:code:preview']"
          @click="previewRef.open(record.id)"
        ><icon-eye /> 预览</a-link>
        <a-popconfirm content="同步会重置字段配置生成信息，确定同步吗?" position="bottom" @ok="sync(record.id)">
          <a-link
            v-auth="['setting:code:sync']"
          ><icon-sync /> 同步</a-link>
        </a-popconfirm>
        <a-link
          v-auth="['setting:code:update']"
          @click="() => editRef.open(record.id)"
        ><icon-edit /> 编辑</a-link>
        <a-link
          v-auth="['setting:code:generate']"
          @click="generateCode(record.id)"
        ><icon-code /> 生成代码</a-link>
      </template>
    </ma-crud>

    <load-table ref="loadTableRef" @success="selectSuccess" />

    <preview ref="previewRef" />

    <edit-info ref="editRef" />

  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import generate from '@/api/setting/generate'
  import { useRouter } from 'vue-router'
  import { Message } from '@arco-design/web-vue'
  import tool from '@/utils/tool'

  import LoadTable from './components/loadTable.vue'
  import Preview from './components/preview.vue'
  import EditInfo from './components/editInfo.vue'

  const crudRef = ref()
  const editRef = ref()
  const previewRef = ref()
  const loadTableRef = ref()
  const selections = ref([])

  const router = useRouter()

  const types = [
    { label: '单表CRUD', value: 'single' },
    { label: '树表CRUD', value: 'tree' },
  ]

  const selectSuccess = (result) => {
    result && crudRef.value.refresh()
  }

  const sync = async (id) => {
    const response = await generate.sync(id)
    response.success && Message.success(response.message)
  }

  const generateCode = async (ids) => {
    Message.info('代码生成下载中，请稍后')
    const response = await generate.generateCode({ ids: ids.toString().split(',') })
    if (response.message && ! response.success) {
      Message.error(response.message)
    } else {
      tool.download(response, 'MineAdmin.zip')
      Message.success('代码生成成功，开始下载')
    }
  }

  const batchGenerate = () => {
    if (selections.value.length === 0) {
      Message.error('至少要选择一条数据')
      return
    }
    generateCode(selections.value.join(','))
  }

  const selectionChange = (row) => selections.value = row

  const crud = reactive({
    api: generate.getPageList,
    showIndex: false,
    searchColNumber: 3,
    searchLabelWidth: '75px',
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 350,
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
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
  ])
</script>

<script>
export default { name: 'setting:code' }
</script>

<style scoped>

</style>
