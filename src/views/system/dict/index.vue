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
    <ma-crud :options="crud" :columns="columns" ref="crudRef">
      <!-- 字典标识列 -->
      <template #code="{ record }">
        <a-tooltip content="点击查看字典数据" v-if="! isRecovery">
          <a-link @click="openDictList(record)">{{ record.code }}</a-link>
        </a-tooltip>
        <span v-else>{{ record.code }}</span>
      </template>
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-switch
          :checked-value="1"
          unchecked-value="2"
          @change="changeStatus($event, record.id)"
          :default-checked="record.status == 1"
        />
      </template>
      <template #operationBeforeExtend="{ record }" v-if="! isRecovery">
        <a-link @click="openDictList(record)"><icon-list /> 字典数据</a-link>
      </template>
    </ma-crud>

    <data-list ref="datalist" />
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue'
  import { dictType } from '@/api/system/dict'
  import { Message } from '@arco-design/web-vue'
  import DataList from './dataList.vue'

  const crudRef = ref()
  const datalist = ref()

  let isRecovery = computed(() => crudRef.value ? crudRef.value.isRecovery : false )

  const changeStatus = async (status, id) => {
    const response = await dictType.changeStatus({ id, status })
    if (response.success) {
      Message.success(response.message)
    }
  }

  const openDictList = async (row) => {
    datalist.value.open(row)
  }

  const crud = reactive({
    api: dictType.getTypeList,
    recycleApi: dictType.getRecycleTypeList,
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationColumnWidth: 240,
    add: { show: true, api: dictType.save, auth: ['system:dict:save'] },
    edit: { show: true, api: dictType.update, auth: ['system:dict:update'] },
    delete: {
      show: true,
      api: dictType.deletes, auth: ['system:dict:delete'],
      realApi: dictType.realDelete, realAuth: ['system:dict:realDeletes']
    },
    recovery: { show: true, api: dictType.recoverys, auth: ['system:dict:recovery']},
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
      title: '字典名称', dataIndex: 'name', search: true, width: 220,
      commonRules: [{ required: true, message: '字典名称必填' }],
    },
    {
      title: '字典标识', dataIndex: 'code', search: true, width: 260,
      commonRules: [{ required: true, message: '字典标识必填' }],
    },
    {
      title: '状态', dataIndex: 'status', search: true, formType: 'radio',
      dict: { name: 'data_status', props: { label: 'title', value: 'key' } },
      addDefaultValue: '1', width: 180,
    },
    {
      title: '备注', dataIndex: 'remark', hide: true, formType: 'textarea',
    },
    {
      title: '创建时间', dataIndex: 'created_at', addDisplay: false, editDisplay: false,
      search: true, formType: 'range', width: 180,
    }
  ])
</script>

<script>
export default { name: 'system:dict' }
</script>

<style scoped>

</style>
