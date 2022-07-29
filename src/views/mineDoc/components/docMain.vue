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
  <a-layout
    class="bg"
    :style="`background-color: ${appStore.mode == 'light' ? '#ebedf1' : '#242424'}`"
  >
    <a-layout-header class="nav flex justify-between p-2">
      <div class="flex text-2xl">
        <img src="logo.svg" width="54" class="mr-2" /> <span class="mt-1">API Document</span>
      </div>
      <ul>
        <li>接口列表</li>
        <li>接口列表</li>
        <li>接口列表</li>
      </ul>
    </a-layout-header>

    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore, useDocStore } from '@/store'
import doc from '@/api/doc'

const docStore = useDocStore()
const appStore = useAppStore()

</script>

<style scoped lang="less">
.bg {
  background-image: url(auth-bg.svg);
  background-size: cover;
  height: 100%;
  overflow-y: auto;
}
.nav {
  height: 55px; background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid var(--color-neutral-3);
  width: 100%; z-index: 2;
  position: absolute;
}
.content {
  position: relative; top: 55px; max-height: calc(100% - 55px);
  overflow-y: auto;
}

[arco-theme="dark"] { 
  .nav {
    background: rgba(53, 52, 52, 0.8);
    color: #fff;
  }
}
</style>