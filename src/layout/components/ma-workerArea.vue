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
  <a-layout-content class="work-area relative p-2">
    <router-view>
      <template #default="{ Component, route}">
        <transition name="fade" mode="out-in">
          <keep-alive :include="keepStore.keepAlives">
            <component :is="Component" :key="route.fullPath" v-if="keepStore.display" />
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </a-layout-content>
</template>

<script setup>
import { useKeepAliveStore } from '@/store'
const keepStore = useKeepAliveStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>