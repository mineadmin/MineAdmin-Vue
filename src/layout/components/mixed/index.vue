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
    <a-layout-header class="ma-ui-header flex justify-between h-50 layout-banner-header operation-area">
      <div class="flex justify-between md:justify-center logo">
        <a-avatar class="mt-1 ml-2 md:ml-0" :size="40"><img :src="`${$url}logo.svg`" class="bg-white" /></a-avatar>
        <span class="ml-2 text-xl mt-2.5 hidden md:block">{{ $title }}</span>
      </div>
      <div class="flex justify-between w-full layout-banner">
        <top-menu v-model="userStore.routers" :active="active" @go="loadMenu" ref="topMenuRef" />
        <ma-operation />
      </div>
    </a-layout-header>
    <div class="flex h-full">
      <a-layout-sider
        class="layout-classic-sider h-full flex flex-col hidden lg:block"
        :style="`width: ${appStore.menuCollapse ? '48px' : appStore.menuWidth + 'px'};`"
        v-show="showMenu"
      >
        <ma-menu
          ref="MaMenuRef"
          height="100%"
          :class="`${appStore.menuCollapse ? 'ml-1.5' : ''};`"
        />
      </a-layout-sider>
      <div class="w-full">
        <ma-tags class="hidden lg:flex ma-ui-tags" />
        <ma-worker-area />
      </div>
    </div>
  </a-layout>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useAppStore, useUserStore } from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import MaOperation from '../ma-operation.vue'
  import MaWorkerArea from '../ma-workerArea.vue'
  import MaTags from '../ma-tags.vue'
  import MaMenu from '../ma-menu.vue'
  import topMenu from './top-menu.vue'

  const route = useRoute()
  const router = useRouter()

  const topMenuRef = ref(null)
  const MaMenuRef = ref(null)
  const userStore = useUserStore()
  const appStore = useAppStore()
  const showMenu = ref(false)
  const active = ref()

  onMounted(() => {
    initMenu()
  })

  watch(() => route, v => {
    initMenu()
  }, { deep: true })

  const initMenu = () => {
    if (route.matched[1]?.meta?.breadcrumb) {
      active.value = route.matched[1].meta.breadcrumb[0].name
    } else {
      active.value = 'home'
    }
    if (userStore.routers && userStore.routers.length > 0) {
      userStore.routers.map((item, index) => {
        if (item.name == active.value) loadMenu(item)
      })
    }
  }

  const loadMenu = (bigMenu) => {
    if (bigMenu.meta.type === 'L') {
      window.open(bigMenu.path)
      return
    }
    if (bigMenu.children.length > 0) {
      MaMenuRef.value.loadChildMenu(bigMenu)
      showMenu.value = true
    } else {
      showMenu.value = false
      router.push(bigMenu.path)
    }
    topMenuRef.value.updateActive(bigMenu.name)
  }
</script>

<style scoped lang="less">
.tags-container {
  border-top:0;
}
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
