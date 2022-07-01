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
    <statistics v-if="userStore.user.dashboard === 'statistics'" />
    <work-panel v-else />
  </a-layout-content>
</template>

<script setup>
import { useUserStore } from '@/store'
import statistics from './components/statistics.vue'
import workPanel from './components/work-panel.vue'
const userStore = useUserStore()
</script>
<script>
export default { name: 'dashboard' }
</script>