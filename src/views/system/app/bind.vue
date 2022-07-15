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
  <a-drawer v-model:visible="visible" width="800px" :before-ok="save" ok-text="保存绑定">
    <template #title>绑定接口</template>
    <a-spin :loading="loading" tip="数据加载中..." class="w-full h-full">
      <div class="w-full">
        <a-space>
          <a-button type="primary"><icon-select-all /> 全选</a-button>
          <a-button type="primary"><icon-eraser /> 清除</a-button>
        </a-space>

        <div
          v-for="(group, index) in apiGroupData"
          :key="index"
          class="mt-5 p-3 rounded"
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
            v-model="apiGroupCheckList[index]"
            v-if="group.apis.length > 0"
          >
            <a-checkbox
              v-for="(item, key) in group.apis"
              :key="key" :label="item.id"
              @change="handleCheckedChange(index, item, group.apis.length)"
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
  import { reactive, ref } from 'vue'
  import apiGroup from '@/api/system/apiGroup'

  const visible = ref(false)
  const loading = ref(true)
  const apiGroupData = ref([])
  const apiGroupCheckList = ref([])
  const checkAll = ref([])

  const save = async (done) => {
  
  }

  const open = (id) => {
    apiGroup.getSelectList({ getApiList: true }).then(res => {
      apiGroupData.value = res.data
      apiGroupData.value.forEach( _ => {
        apiGroupCheckList.value.push([])
        checkAll.value.push(false)
      })
      loading.value = false
    })
    visible.value = true
  }

  defineExpose({ open })
</script>