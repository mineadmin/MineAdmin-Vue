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
  <div class="w-full lg:w-3/12 ma-content-block rounded-sm ml-0 lg:ml-3 p-3 mt-3">
    <div class="flex">
      MineAdmin 相关
    </div>
    <div class="block lg:grid lg:grid-cols-2 lg:gap-1 mt-3">
      <a-card class="rounded-sm text-center" :body-style="{ padding: 0 }" :bordered="false">
        <a-button
          type="outline"
          class="w-4/5"
          @click="openPage('https://www.mineadmin.com')"
        >官方网站</a-button>
      </a-card>
      <a-card class="rounded-sm text-center mt-2 lg:mt-0" :body-style="{ padding: 0 }" :bordered="false">
        <a-button
          type="outline"
          class="w-4/5"
          @click="openPage('https://doc.mineadmin.com')"
        >开发文档</a-button>
      </a-card>
      <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
        <a-button
          type="outline"
          class="w-4/5"
          @click="openPage('https://github.com/kanyxmo/MineAdmin')"
        >Github</a-button>
      </a-card>
      <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
        <a-button
          type="outline"
          class="w-4/5"
          @click="openPage('https://gitee.com/xmo/MineAdmin')"
        >Gitee </a-button>
      </a-card>
      <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
        <a-button
          type="outline"
          class="w-4/5"
          @click="openPage('https://gitee.com/xmo/MineAdmin/releases')"
        >更新日志</a-button>
      </a-card>
      <a-card class="rounded-sm text-center mt-2" :body-style="{ padding: 0 }" :bordered="false">
        <a-button
          type="outline"
          class="w-4/5"
          @click="openPage('https://doc.mineadmin.com/faqs/')"
        >常见问题</a-button>
      </a-card>
    </div>
    <div class="w-11/12 mx-auto mt-3">
      <a-tag class="ml-0.5">MineAdmin v{{ config.version }} release</a-tag>
    </div>
  </div>
</template>

<script setup>
  import config from '@/../package.json'

  const openPage = (url = '') => {
    window.open(url)
  }
</script>