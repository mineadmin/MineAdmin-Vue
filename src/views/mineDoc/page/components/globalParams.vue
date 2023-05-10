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
  <a-modal v-model:visible="visible" :on-before-ok="save" width="700px" draggable :align-center="false" top="50">
    <template #title>设置全局参数</template>
    <a-tabs type="rounded" v-model:active-key="activeTab">
      <a-tab-pane key="query" title="设置全局Query">
        <div class="pl-2 pr-2">
          <a-button type="primary" class="mb-3" @click="add" ><icon-plus /> 新增</a-button>
          <a-table :data="globalParams.query" :pagination="false">
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
      <a-tab-pane key="body" title="设置全局Body">
        <div class="pl-2 pr-2">
          <a-button type="primary" class="mb-3" @click="add" ><icon-plus /> 新增</a-button>
          <a-table :data="globalParams.body" :pagination="false">
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
      <a-tab-pane key="header" title="设置全局Header">
        <div class="pl-2 pr-2">
          <a-button type="primary" class="mb-3" @click="add" ><icon-plus /> 新增</a-button>
          <a-table :data="globalParams.header" :pagination="false">
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
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDocStore } from '@/store'
import { Message } from '@arco-design/web-vue'

const docStore = useDocStore()
const activeTab = ref('query')
const visible = ref(false)
const globalParams = reactive({
  header: [],
  query: [],
  body: []
})

const open = () => {
  init()
  visible.value = true
}

const add = () => {
  globalParams[activeTab.value].push({ name: '', value: '' })
}

const del = (idx) => {
  globalParams[activeTab.value].splice(idx, 1)
}

const save = (done) => {
  let header = {}
  let query  = {}
  let body   = {}

  globalParams.header.map(item => {
    header[item.name] = item.value
  })
  globalParams.query.map(item => {
    query[item.name] = item.value
  })
  globalParams.body.map(item => {
    body[item.name] = item.value
  })
  docStore.globalParams = { header, query, body }
  Message.success('设置成功')
  done(true)
}

const saveAuthGlobalParams = (appId, identity, accessToken) => {
    init()
    let header = {}
    let query  = {}
    let body   = {}

    globalParams.header.map(item => {
        header[item.name] = item.value
    })
    globalParams.query.map(item => {
        query[item.name] = item.value
    })
    globalParams.body.map(item => {
        body[item.name] = item.value
    })
    if (appId !=='' && identity !== '') {
        query['app_id'] = appId
        query['identity'] = identity
    }
    if (accessToken !== '') {
        query['access_token'] = accessToken
    }
    docStore.globalParams = { header, query, body }
}

const init = () => {
  if (docStore.globalParams) {
    globalParams.query = []
    globalParams.body = []
    globalParams.header = []

    for (let name in docStore.globalParams.header) {
      globalParams.header.push({ 'name': name, value: docStore.globalParams.header[name] })
    }
    for (let name in docStore.globalParams.query) {
      globalParams.query.push({ 'name': name, value: docStore.globalParams.query[name] })
    }
    for (let name in docStore.globalParams.body) {
      globalParams.body.push({ 'name': name, value: docStore.globalParams.body[name] })
    }
  }
}

defineExpose({ open, saveAuthGlobalParams })
</script>