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
    <a-layout-header class="flex justify-between h-50 layout-banner-header">
      <div class="flex justify-between md:justify-center logo">
        <a-avatar class="mt-1 ml-2 md:ml-0" :size="40"><img src="/logo.svg" class="bg-white" /></a-avatar>
        <span class="ml-2 text-xl mt-2.5 hidden md:block">MineAdmin</span>
      </div>
      <div class="flex justify-between w-full">
        <ul class="flex items-center banner-menus hidden lg:flex">
          <li
            v-for="(bigMenu, index) in userStore.routers"
            :key="index"
            @click="loadMenu(bigMenu, index)"
            class="flex items-center"
          >
            <component v-if="bigMenu.meta.icon" :is="bigMenu.meta.icon" class="icon" />
            <span class="ml-0.5">{{ bigMenu.meta.title }}</span>
          </li>
        </ul>
        <ma-operation />
      </div>
    </a-layout-header>
    <a-layout class="flex h-full justify-between">
      <a-layout-sider
        :style="`width: ${appStore.menuCollapse ? '48px' : appStore.menuWidth + 'px'};`"
        class="hidden lg:flex"
      >
        <ma-menu ref="MaMenu" :class="appStore.menuCollapse ? 'ml-0.5' : ''" />
      </a-layout-sider>
      <a-layout class="flex flex-col">
        <ma-tags class="hidden lg:flex" />
        <ma-worker-area />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useAppStore, useUserStore } from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import maOperation from '../ma-operation.vue'
  import maWorkerArea from '../ma-workerArea.vue'
  import maTags from '../ma-tags.vue'
  import maMenu from '../ma-menu.vue'

  const route = useRoute()

  const MaMenu = ref(null)
  const userStore = useUserStore()
  const appStore = useAppStore()

  onMounted(() => {
    setTimeout(() => {
      userStore.routers.map((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.filter( (r, idx) => {
            if (r.name === route.name) loadMenu(userStore.routers[index], index, idx)
          })
        }
      })
    }, 50)
  })

  const loadMenu = (bigMenu, index, idx = 0) => {
    MaMenu.value.loadChildMenu(bigMenu, index, idx)
    // title.value = MaMenu.value.title
    document.querySelectorAll('.banner-menus li').forEach( (item, id) => {
      index !== id ? item.classList.remove('active') : item.classList.add('active')
    })
  }
</script>

<style scoped>
.tags {
  margin-top: -1px;
}
:deep(.arco-menu-collapse-button) {
  right: 10px;
}
</style>