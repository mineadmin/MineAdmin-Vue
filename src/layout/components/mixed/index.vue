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
    <div class="flex" :style="`height:calc(100% - ${appStore.tag ? '87px' : '52px'}); `">
      <a-layout-sider
        id="layout-mixed-left-panel"
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
      <div class="w-full" :style="`width: calc(100% - ${containerWidth}px)`">
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
  import ResizeObserver from 'resize-observer-polyfill'
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

  const containerWidth = ref(0)

  onMounted(() => {
    const dom = document.getElementById('layout-mixed-left-panel')
    const robserver = new ResizeObserver( entries => {
      for (const entry of entries) {
        // 可以通过 判断 entry.target得知当前改变的 Element，分别进行处理。
        switch(entry.target){
          case dom :
            containerWidth.value = entry.contentRect.width
          break
        }
      }
    })
    robserver.observe(dom)
  })
</script>

<style scoped lang="less">
.tags-container {
  border-top:0;
}
:deep(.tags-container .tags) {
  border-bottom: 0 !important;
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
