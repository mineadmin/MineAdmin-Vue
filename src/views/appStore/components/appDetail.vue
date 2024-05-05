<script setup lang="ts">
import { ref } from 'vue'
import { getDetail } from "@/api/store"

const visible = ref(false)
const loading = ref(false)
const data = ref({})
const open = (identifier) => {
  visible.value = true
  loading.value = true
  getDetail({ identifier }).then(res => {
    loading.value = false
    data.value = res.data.data
    console.log(data.value)
  })
}

defineExpose({ open })
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :title="data?.app?.name ?? '获取中...'"
    width="800px" :footer="false"
  >
    <a-spin tip="获取数据中..." :loading="loading" class="w-full">
      <div class="flex">

      </div>
    </a-spin>
  </a-drawer>
</template>

<style scoped>

</style>