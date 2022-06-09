<template>
  <div class="tags flex items-center content-center" v-if="appStore.tag">
    <a>仪表盘 <icon-close class="tag-icon" /></a>
    <a class="active">仪表盘 <icon-close class="tag-icon" /></a>
  </div>
</template>

<script setup>
  import { useAppStore, useUserStore } from '@/store'
  const appStore  = useAppStore()

</script>
