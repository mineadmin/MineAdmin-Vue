<script setup>
import { ref } from 'vue'

const isDev = ref(import.meta.env.DEV)
</script>

<template>
  <div class="ma-content-block p-4 h-full overflow-y-auto">
    <div v-if="isDev">
      <div class="">

      </div>
    </div>
    <div v-else>
      <a-result status="info" title="说明">
        <template #subtitle>
          应用市场只在开发环境开放使用。
        </template>
      </a-result>
    </div>
  </div>
</template>

<style scoped>

</style>
<script>export default { name: 'store' }</script>