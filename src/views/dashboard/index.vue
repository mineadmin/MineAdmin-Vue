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
  <a-layout-content class="flex flex-col">
    <div class="flex justify-between">
      <div class="ma-content-block flex w-full lg:w-10/12 p-3">
        <a-avatar :size="75" class="hidden lg:block">
          <img
            :src="
            (userStore.user && userStore.user.avatar)
            ? userStore.user.avatar
            : '/avatar.jpg'"
          />
        </a-avatar>
        <div class="pl-0 lg:pl-5">
          <div class="content-block-title">
            {{ userStore.user.nickname || userStore.username }}，欢迎回来！
          </div>
          <div class="leading-7">
            欢迎使用MineAdmin后台权限管理系统，系统全部开源、免费使用。
            开源需要大家支持，喜欢的请点个 Star
          </div>
        </div>
      </div>
    </div>
  </a-layout-content>
</template>

<script setup>
import { useUserStore } from '@/store'
const userStore = useUserStore()
</script>