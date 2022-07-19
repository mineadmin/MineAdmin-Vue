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
  <div class="ma-content-block p-5">
    <a-tabs type="rounded" v-model:active-key="active" show-add-button auto-switch>
      <a-tab-pane key="system" title="系统配置">asdasd</a-tab-pane>
      <a-tab-pane key="extend" title="扩展组配置">asdasd</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const active = ref('system')

</script>
<script>
export default { name: 'system' }
</script>

<style scoped>

</style>