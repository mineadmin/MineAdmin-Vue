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

      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup>
  import { ref } from 'vue'

  const visible = ref(false)
  const loading = ref(true)

  const save = (done) => {

  }

  const open = (id) => {
    console.log(id)
    visible.value = true
  }

  defineExpose({ open })
</script>