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
  <div class="ma-content-block p-5 h-full">
    <ma-resource class="h-full" v-model="ok" :multiple="true" />
    {{ ok }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
const ok = ref()


</script>

<style scoped>

</style>