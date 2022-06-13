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

<style scoped lang="scss">
[mine-skin="mine"] {
  .tags a {
    margin-left: 4px; margin-right: 0;
  }
}
</style>