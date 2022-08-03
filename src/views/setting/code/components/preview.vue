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
  <a-modal width="1000px" v-model:visible="visible" :footer="false" :align-center="false" top="50px">
    <template #title>预览代码</template>
    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane
        v-for="(item, index) in previewCode"
        :key="index"
        :label="item.tab_name"
        :name="item.name"
      >
      aa
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
  import { ref } from 'vue'
  import generate from '@/api/setting/generate'
  import { Message } from '@arco-design/web-vue'

  const activeTab = ref('controller')
  const visible = ref(false)
  const previewCode = ref([])

  const open = async (id) => {
    const response = await generate.preview({ id })
    if (response.success) {
      previewCode.value = response.data
      visible.value = true
    } else {
      Message.info(response.message)
    }
  }

  defineExpose({ open })
</script>