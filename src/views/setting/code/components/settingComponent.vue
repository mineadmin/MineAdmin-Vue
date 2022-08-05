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
  <a-modal v-model:visible="visible" :on-before-ok="save" width="600px" draggable>
    <template #title>设置组件 - {{ row?.column_comment }}</template>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const row = ref({})

const open = (record) => {
  row.value = record
  visible.value = true
}

const save = (done) => {}

defineExpose({ open })
</script>