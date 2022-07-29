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
  <a-modal v-model:visible="visible" :on-before-ok="save" width="700px" draggable>
    <template #title>设置全局参数</template>
    <a-tabs type="rounded" v-model="activeTab">
      <a-tab-pane key="query" title="设置全局Query">
        Content of Tab Panel 1
      </a-tab-pane>
      <a-tab-pane key="body" title="设置全局Body">
        Content of Tab Panel 2
      </a-tab-pane>
      <a-tab-pane key="header" title="设置全局Header">
        Content of Tab Panel 3
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDocStore } from '@/store'

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

const save = () => {}

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

defineExpose({ open })
</script>