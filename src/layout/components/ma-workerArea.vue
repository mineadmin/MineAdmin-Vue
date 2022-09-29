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
    <div class="h-full" :class="{ 'p-3': $route.path.indexOf('maIframe') === -1 }">
      <router-view v-slot="{ Component }">
        <transition :name="appStore.animation" mode="out-in">
          <keep-alive :include="keepStore.keepAlives">
            <component :is="Component" :key="$route.fullPath" v-if="keepStore.show" />
          </keep-alive>
        </transition>
      </router-view>
      <iframe-view />
    </div>
  </a-layout-content>
</template>

<script setup>
  import { useAppStore, useKeepAliveStore } from '@/store'
  import IframeView from './components/iframe-view.vue'
  const appStore = useAppStore()
  const keepStore = useKeepAliveStore()
</script>