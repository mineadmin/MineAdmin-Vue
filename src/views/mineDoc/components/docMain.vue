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
        <img src="/logo.svg" width="54" class="mr-2" /> <span class="mt-1">API Document</span>
      </div>
      <a-space>
        <div
          v-for="item in menuList"
          :key="item.to"
          :class="`menu ${$route.path === item.to ? 'active' : ''}`"
          @click="go(item.to)"
        >{{ item.name }}</div>
        <div class="menu" @click="logoutDoc">退出文档</div>
      </a-space>
    </a-layout-header>

    <a-layout-content class="content">
      <router-view />
    </a-layout-content>

    <a-layout-footer
      class="footer"
      :style="`background-color: ${appStore.mode == 'light' ? '#fff' : '#242424'}`"
    >
      MineAdmin v{{ config.version }} release Copyright © 2021-{{dayjs().format('YYYY')}} mineadmin.com All Rights Reserved.
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAppStore, useDocStore } from '@/store'
import { useRouter } from 'vue-router'
import config from '@/../package.json'
import dayjs from 'dayjs'

const menuList = reactive([
  { to: '/interfaceList', name: '接口列表' },
  { to: '/interfaceCode', name: '代码释义' },
  { to: '/signature', name: '签名算法' }
])

const docStore = useDocStore()
const appStore = useAppStore()
const router = useRouter()

const go = (route) => {
  router.push(route)
}

const logoutDoc = () => {
  docStore.auth = false
  docStore.appId = undefined
  docStore.appSecret = undefined
  router.push({ name: 'mineDoc' })
}

</script>

<style scoped lang="less">
.bg {
  background-image: url(auth-bg.svg);
  background-size: cover;
  height: 100%;
  overflow-y: auto;
}
.footer {
  position: absolute; bottom: 0;
  height: 38px; background: rgba(255, 255, 255, 1);
  backdrop-filter: blur(5px);
  border-top: 1px solid var(--color-neutral-3);
  width: 100%; z-index: 2;
  font-size: 12px; line-height: 38px;
  text-align: center;
  color: var(--color-text-3);
}
.nav {
  height: 55px; background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid var(--color-neutral-3);
  width: 100%; z-index: 2;
  position: absolute;
}
.content {
  position: relative; top: 55px; max-height: calc(100% - 93px);
  overflow-y: auto;
}

.menu {
  padding: 0 10px; cursor: pointer;
  height: 54px; line-height: 54px;
}
.menu:hover {
  background: var(--color-primary-light-1);
}
.menu.active {
  color: rgb(var(--primary-6));
  border-bottom: 2px solid rgb(var(--primary-6));
}

[arco-theme="dark"] { 
  .nav {
    background: rgba(53, 52, 52, 0.8);
    color: #fff;
  }
}
</style>