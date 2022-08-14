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
  <a-layout-header class="layout-header flex flex-col operation-area">
    <div class="flex justify-between" style="height: 50px;">
      <a-avatar class="mt-1 ml-2 inline lg:hidden" style="width:45px;" :size="40"><img src="/logo.svg" class="bg-white" /></a-avatar>
      <ma-breadcrumb />
      <ma-operation />
    </div>
    <ma-tags class="hidden lg:flex" />
  </a-layout-header>
</template>

<script setup>
  import MaBreadcrumb from '../ma-breadcrumb.vue'
  import MaOperation from '../ma-operation.vue'
  import MaTags from '../ma-tags.vue'
</script>
