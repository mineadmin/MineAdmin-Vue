<template>
  <a-layout-content class="layout flex justify-between">
    <div class="layout-columns-left-panel hidden lg:flex justify-between">
      <ma-columns-menu />
    </div>

    <div class="layout-columns-right-panel">

      <ma-columns-header />
      <ma-worker-area />

    </div>
  </a-layout-content>
</template>
<script setup>
  import maColumnsHeader from './ma-columns-header.vue'
  import maColumnsMenu from './ma-columns-menu.vue'

  import maWorkerArea from '../ma-workerArea.vue'
</script>