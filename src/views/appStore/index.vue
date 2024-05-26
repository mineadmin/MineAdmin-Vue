<script setup>
import { ref } from 'vue'
import { hasAccessToken } from '@/api/store.js'
import { useRoute } from "vue-router"
import Notice from "@/views/appStore/components/notice.vue"
import AppList from "@/views/appStore/components/appList.vue"
import NoDev from "@/views/appStore/components/noDev.vue"

const route = useRoute()
const isDev = ref(import.meta.env.DEV)
const isHasAccessToken = ref(false)

if (isDev) {
  hasAccessToken().then(res => {
    if (res.code === 200) {
      isHasAccessToken.value = ! res.data.isHas
    }
  })
}
</script>

<template>
  <div class="ma-content-block p-4 h-full overflow-y-auto mine-ui-scrollbars">
    <Notice :isHasAccessToken="isHasAccessToken" />
    <div v-if="isDev">
      <AppList :isHasAccessToken="isHasAccessToken" />
    </div>
    <div v-else>
      <NoDev />
    </div>
  </div>
</template>
<script>export default { name: 'store' }</script>