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
  <a-layout-content class="work-area customer-scrollbar relative">
    <div class="p-3 h-full" v-if="$route.meta.type !== 'I'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive :include="keepStore.keepAlives">
            <component :is="Component" :key="$route.name" v-if="keepStore.show" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <div v-else class="h-full">
      <transition name="fade" mode="out-in">
        <iframe-view />
      </transition>
    </div>
  </a-layout-content>
</template>

<script setup>
  import { useKeepAliveStore } from '@/store'
  import iframeView from './components/iframe-view.vue'
  const keepStore = useKeepAliveStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>