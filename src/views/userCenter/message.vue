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
  <div class="ma-content-block p-1 h-full">
    <!-- <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
    >
      <a-menu-item key="0_0">Menu 1</a-menu-item>
      <a-menu-item key="0_1">Menu 2</a-menu-item>
      <a-menu-item key="0_2">Menu 3</a-menu-item>
      <a-menu-item key="0_3">Menu 4</a-menu-item>
      <a-menu-item key="2_0">Menu 1</a-menu-item>
    </a-menu> -->
    <ma-user v-model="ok" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const ok = ref([1])


</script>

<style scoped>

</style>