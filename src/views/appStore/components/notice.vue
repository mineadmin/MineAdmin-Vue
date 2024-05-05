<script setup>
const props = defineProps({
  isHasAccessToken: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <a-modal v-model:visible="props.isHasAccessToken" title="后端未设置 MINE_ACCESS_TOKEN" :mask-closable="false" :footer="false">
    <div class="text-red-600 text-base">请按照以下步骤设置：</div>
    <ol class="leading-7 mt-3">
      <li>1. 进入<a-link target="_blank" href="https://www.mineadmin.com/login?redirect=/member/setting">MineAdmin官网</a-link>设置页面，获取 <span class="text-green-800">AccessToken</span></li>
      <li>2. 打开后端 <span class="text-green-800">.env</span> 配置文件</li>
      <li>3. 添加此行配置：<a-tag color="red">MINE_ACCESS_TOKEN = 获取到的AccessToken</a-tag></li>
      <li>4. 重启后端服务，完成配置</li>
    </ol>
  </a-modal>
</template>

<style scoped>

</style>