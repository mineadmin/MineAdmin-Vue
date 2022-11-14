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
  <a-layout class="layout flex flex-col h-full">
    <a-layout-header class="flex justify-between h-50 layout-banner-header operation-area">
      <div class="flex justify-between md:justify-center logo">
        <a-avatar class="mt-1 ml-2 md:ml-0" :size="40"><img src="/logo.svg" class="bg-white" /></a-avatar>
        <span class="ml-2 text-xl mt-2.5 hidden md:block">MineAdmin</span>
      </div>
      <div class="flex justify-between w-full layout-banner">
        <children-banner v-model="userStore.routers" />
        <ma-operation />
      </div>
    </a-layout-header>
    <ma-tags class="hidden lg:flex" />
    <ma-worker-area />
  </a-layout>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useAppStore, useUserStore } from '@/store'
  import { useRoute } from 'vue-router'
  import MaOperation from '../ma-operation.vue'
  import MaWorkerArea from '../ma-workerArea.vue'
  import MaTags from '../ma-tags.vue'
  import ChildrenBanner from '../components/children-banner.vue'

  const route = useRoute()

  const MaMenuRef = ref(null)
  const userStore = useUserStore()
  const appStore = useAppStore()
  const actives = ref([])

  onMounted(() => {
    actives.value = [ route.name ]
  })

  watch(() => route, v => {
    actives.value = [ v.name ]
  }, { deep: true })
</script>

<style scoped lang="less">
.tags {
  margin-top: -1px;
}
:deep(.arco-menu-collapse-button) {
  right: 10px;
}
:deep(.layout-banner .arco-menu-horizontal .arco-menu-inner) {
  align-items: none;
  padding: 8px 10px;
  overflow-y: hidden;
}
:deep(.sys-menus .arco-menu-icon svg) {
  display: inline; vertical-align: none;
  margin-bottom: 1px;
}
:deep(.sys-menus .arco-menu-icon .icon) {
  padding-bottom: 1px;
}
</style>
