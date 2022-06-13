<script setup>
  import lang from '@arco-design/web-vue/es/locale/lang/zh-cn'
  import { ref } from 'vue'
  const zhCN = ref(lang)
</script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>