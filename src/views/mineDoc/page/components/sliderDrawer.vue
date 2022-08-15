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
  <a-drawer v-model:visible="visible" width="700px" :footer="false">
    <template #title>{{ row.name }}</template>
    <a-tabs type="rounded" v-model:active-key="activeTab">
      <a-tab-pane key="paramsList" title="参数列表">
        <div class="pl-2 pr-2">
          <a-divider orientation="left">接口信息</a-divider>
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="接口地址">/api/v1/{{ row.access_name }}</a-descriptions-item>
            <a-descriptions-item label="认证模式">
              <a-tag v-if="row.auth_mode === 1" color="green" bordered>简易模式</a-tag>
              <a-tag v-else color="red" bordered>复杂模式</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="认证说明">
              <div v-if="row.auth_mode === 1">
                简易模式下，只需要在接口后面带上 <a-tag color="orangered">app_id</a-tag> 和<a-tag color="orangered">identity</a-tag>
              </div>
              <div v-else>
                复杂模式下，先需要获取 <a-tag color="blue">AccessToken</a-tag>，再以此请求接口
              </div>
            </a-descriptions-item>
          </a-descriptions>
          <a-divider orientation="left">请求参数</a-divider>
          <a-table :data="requestData" :columns="requestCols">
            <template #dataType="{ record }">
              <template v-for="dic in dictData" :key="dic.id">
                <a-tag color="blue" v-if="dic.key == record.data_type">{{ dic.title }}</a-tag>
              </template>
            </template>
            <template #required="{ record }">
              <a-tag color="red" v-if="record.is_required === 1">是</a-tag>
              <a-tag color="green" v-else>否</a-tag>
            </template>
          </a-table>
          <a-divider orientation="left">响应参数</a-divider>
          <a-table :data="responseData" :columns="responseCols">
            <template #dataType="{ record }">
              <template v-for="dic in dictData" :key="dic.id">
                <a-tag color="blue" v-if="dic.key == record.data_type">{{ dic.title }}</a-tag>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="simRequest" title="模拟请求">
        <sim-request :row="row" />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup>
import { reactive, ref, h } from 'vue'
import doc from '@/api/doc'
import commonApi from '@/api/common'
import SimRequest from './simRequest.vue'

const visible = ref(false)
const row = ref({})
const activeTab = ref('paramsList')

const dictData = ref([])
const requestData = ref([])
const responseData = ref([])

const requestCols = reactive([
  { title: '参数名', dataIndex: 'name' },
  { title: '数据类型', dataIndex: 'data_type', slotName: 'dataType' },
  { title: '是否必填', dataIndex: 'is_required', slotName: 'required' },
  { title: '默认值', dataIndex: 'default_value' },
])
const responseCols = reactive([
  { title: '参数名', dataIndex: 'name' },
  { title: '数据类型', dataIndex: 'data_type', slotName: 'dataType'  },
  { title: '更新时间', dataIndex: 'updated_at' },
])

const open = async (record) => {
  row.value = record
  await getColumnList()
  const response = await commonApi.getDict('api_data_type')
  dictData.value = response.data
  visible.value = true
}

const getColumnList = async () => {
  const res = await doc.getColumnList(row.value.id)
  requestData.value = []
  responseData.value = []
  res.data.api_column.map(item => {
    item.type === 1 ? requestData.value.push(item) : responseData.value.push(item)
  })
}

defineExpose({ open })
</script>
