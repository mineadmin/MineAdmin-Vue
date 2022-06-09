<script setup>
  import lang from '@arco-design/web-vue/es/locale/lang/zh-cn'
  import { ref, h } from 'vue'
  import { useAppStore } from './store'
  const zhCN = ref(lang)
  const appStore = useAppStore()
  const linkcss = h('link', { rel: 'stylesheet', href: `/skins/${appStore.theme || 'mine'}/index.css` })
</script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view />
    <linkcss />
  </a-config-provider>
</template>