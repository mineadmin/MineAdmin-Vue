<template>
  <a-layout-header class="layout-classic-header flex flex-col operation-area">
    <div class="flex justify-between layout-classic-header-container">
      <a-avatar class="mt-1 ml-2 inline lg:hidden" style="width:45px;" :size="40"><img src="/logo.svg" class="bg-white" /></a-avatar>
      <ma-breadcrumb />
      <ma-operation />
    </div>
    <ma-tags class="hidden lg:flex" />
  </a-layout-header>
</template>

<script setup>
  import maBreadcrumb from '../ma-breadcrumb.vue'
  import maOperation from '../ma-operation.vue'
  import maTags from '../ma-tags.vue'
</script>