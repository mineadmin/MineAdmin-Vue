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
  <div class="h-full">
    <doc-main v-if="docStore.auth" />
    <auth v-else  />
  </div>
</template>

<script setup>
import { useDocStore } from '@/store'
import Auth from './components/auth.vue'
import DocMain from './components/docMain.vue'

const docStore = useDocStore()
</script>
