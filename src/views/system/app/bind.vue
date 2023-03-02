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
  <a-drawer v-model:visible="visible" width="800px" :on-before-ok="save" ok-text="保存绑定">
    <template #title>绑定接口</template>
    <a-spin :loading="loading" tip="数据加载中..." class="w-full h-full">
      <div class="w-full">
        <a-space>
          <a-button type="primary" @click="selectAll">
            <template #icon><icon-select-all /></template>全选</a-button>
          <a-button type="primary" @click="flushAll"><template #icon><icon-eraser /></template>清除</a-button>
        </a-space>

        <div
          v-for="(group, index) in apiGroupData"
          :key="index"
          class="mt-5 p-3 rounded flex flex-col"
          style="border: 1px solid var(--color-border-2)"
        >
          <a-space>
            {{ group.name }}
            <a-checkbox
              v-model="checkAll[index]"
              @change="handleCheckAllChange(index, group.apis)"
            >全选</a-checkbox>
          </a-space> 
          <a-checkbox-group
            class="mt-3"
            v-model="apiGroupCheckList[index]"
            v-if="group.apis.length > 0"
          >
            <a-checkbox
              v-for="(item, key) in group.apis"
              :key="key"
              :value="item.id"
            >
              {{item.name}}
            </a-checkbox>
          </a-checkbox-group>
          <a-empty v-else >暂无接口</a-empty>
        </div>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup>
  import { ref } from 'vue'
  import { uniq } from 'lodash'
  import apiGroup from '@/api/system/apiGroup'
  import app from '@/api/system/app'
  import { Message } from '@arco-design/web-vue'

  const visible = ref(false)
  const loading = ref(true)
  const appId = ref()
  const apiGroupData = ref([])
  const apiGroupCheckList = ref([])
  const checkAll = ref([])

  const open = async (id) => {
    appId.value = id
    visible.value = true
    await requestApiList()
    await setBindData()
    loading.value = false
  }

  const save = async (done) => {
    const ids = []
    apiGroupCheckList.value.map( item => ids.push(...item) )
    if (appId.value) {
      const response = await app.bind(appId.value, { apiIds: uniq(ids) })
      if (response.success) {
        Message.success(response.message)
        done(true)
        return
      }
      done(false)
    }
    done(false)
  }

  const requestApiList = async () => {
    const response = await apiGroup.getSelectList({ getApiList: true })
    apiGroupData.value = response.data
    apiGroupData.value.forEach( _ => {
      apiGroupCheckList.value.push([])
      checkAll.value.push(false)
    })
  }

  const setBindData = async () => {
    const response = await app.getBindApiList({ id: appId.value })
    if (response.success && response.data.length > 0) {
      response.data.map(id => {
        apiGroupData.value.map((rows, index) => {
          rows.apis.map(async item => {
            if (item.id == id) {
              apiGroupCheckList.value[index].push(item.id)
            }
          })
          if (apiGroupCheckList.value[index].length == rows.apis.length) {
            checkAll.value[index] = true
          }
        })
      })
    }
  }

  // 分组全选
  const handleCheckAllChange = (index, rows) => {
    if (! checkAll.value[index]) {
      apiGroupCheckList.value[index] = []
    } else {
      rows.map(row => {
        apiGroupCheckList.value[index].push(row.id)
      })
    }
  }

  const selectAll = () => {
    apiGroupData.value.map((row, index) => {
      checkAll.value[index] = true
      handleCheckAllChange(index, row.apis)
    })
  }

  const flushAll = () => {
    apiGroupData.value.map((row, index) => {
      checkAll.value[index] = false
      apiGroupCheckList.value[index] = []
    })
  }

  defineExpose({ open })
</script>