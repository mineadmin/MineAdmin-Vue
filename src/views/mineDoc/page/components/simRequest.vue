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
  <div class="pl-2 pr-2">
    <a-form :model="form">
      <a-input-group>
        <div class="mr-3 w-28">请求地址</div>
        <a-select :options="methods" style="width: 130px" v-model="form.mode" />
        <a-input v-model="form.url" placeholder="请输入接口地址" />
        <a-button type="primary" @click="requestServer"><icon-send /> 发送请求</a-button>
      </a-input-group>
    </a-form>
    <a-tabs v-model:active-key="activeTab" class="mt-5">
      <a-tab-pane key="query" title="设置Query">
        <div class="pl-2 pr-2">
          <a-button type="primary" class="mb-3" @click="add" ><icon-plus /> 新增</a-button>
          <a-table :data="params.query" :pagination="false">
            <template #columns>
              <a-table-column title="#">
                <template #cell="{rowIndex}">
                  <a-button type="outline" @click="del(rowIndex)"><template #icon><icon-delete /></template></a-button>
                </template>
              </a-table-column>
              <a-table-column title="键名" field="name">
                <template #cell="{ record }">
                  <a-input v-model="record.name" allow-clear placeholder="请输入键名" />
                </template>
              </a-table-column>
              <a-table-column title="值" field="value">
                <template #cell="{ record }">
                  <a-input v-model="record.value" allow-clear placeholder="请输入值" />
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="body" title="设置Body">
        <div class="pl-2 pr-2">
          <a-button type="primary" class="mb-3" @click="add" ><icon-plus /> 新增</a-button>
          <a-table :data="params.body" :pagination="false">
            <template #columns>
              <a-table-column title="#">
                <template #cell="{rowIndex}">
                  <a-button type="outline" @click="del(rowIndex)"><template #icon><icon-delete /></template></a-button>
                </template>
              </a-table-column>
              <a-table-column title="键名" field="name">
                <template #cell="{ record }">
                  <a-input v-model="record.name" allow-clear placeholder="请输入键名" />
                </template>
              </a-table-column>
              <a-table-column title="值" field="value">
                <template #cell="{ record }">
                  <a-input v-model="record.value" allow-clear placeholder="请输入值" />
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="header" title="设置Header">
        <div class="pl-2 pr-2">
          <a-button type="primary" class="mb-3" @click="add" ><icon-plus /> 新增</a-button>
          <a-table :data="params.header" :pagination="false">
            <template #columns>
              <a-table-column title="#">
                <template #cell="{rowIndex}">
                  <a-button type="outline" @click="del(rowIndex)"><template #icon><icon-delete /></template></a-button>
                </template>
              </a-table-column>
              <a-table-column title="键名" field="name">
                <template #cell="{ record }">
                  <a-input v-model="record.name" allow-clear placeholder="请输入键名" />
                </template>
              </a-table-column>
              <a-table-column title="值" field="value">
                <template #cell="{ record }">
                  <a-input v-model="record.value" allow-clear placeholder="请输入值" />
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-divider orientation="left">服务器响应</a-divider>
    <ma-code-editor v-model="response" :height="240" :readonly="true" :isBind="true" />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useDocStore } from '@/store'
import { formatJson } from '@/utils/common'
import { request } from '@/utils/request.js'
import { Message } from '@arco-design/web-vue'

const docStore = useDocStore()
const response = ref('')

const props = defineProps({ row: Object })
const activeTab = ref('query')
const methods = ref([
  { label: '所有模式', value: 'A'},
  { label: 'GET', value: 'G'},
  { label: 'POST', value: 'P'},
  { label: 'PUT', value: 'U'},
  { label: 'DELETE', value: 'D'},
])

const params = reactive({
  header: [],
  query: [],
  body: []
})

const add = () => {
  params[activeTab.value].push({ name: '', value: '' })
}

const del = (idx) => {
  params[activeTab.value].splice(idx, 1)
}

const form = ref({
  mode: props.row?.request_mode,
  url: `/api/v1/${props.row?.access_name}`
})

const requestServer = async () => {
  if (form.value.url === '') {
    Message.info('请输入请求地址')
    return
  }

  let mode
  switch (form.value.mode) {
    case 'P': {
      mode = 'POST'
      break
    }
    case 'D': {
      mode = 'DELETE'
      break
    }
    case 'U': {
      mode = 'PUT'
      break
    }
    default: mode = 'GET'
  }

  let header = {}
  let query  = {}
  let body   = {}

  params.header.map(item => {
    header[item.name] = item.value
  })
  params.query.map(item => {
    query[item.name] = item.value
  })
  params.body.map(item => {
    body[item.name] = item.value
  })

  const config = {
    header: Object.assign(header, docStore.globalParams?.header),
    params: Object.assign(query, docStore.globalParams?.query),
    data  : Object.assign(body, docStore.globalParams?.body),
    url: form.value.url,
    method: mode,
  }

  const res = await request(config)
  response.value = formatJson(res)
}

watch(
  () => props.row,
  vl => {
    form.value.mode = vl?.request_mode
    form.value.url  = `/api/v1/${vl?.access_name}`
  }
)
</script>