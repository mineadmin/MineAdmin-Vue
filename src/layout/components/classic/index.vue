<template>
  <a-layout class="layout flex justify-between h-full">
    
    <ma-classic-sider />

    <a-layout-content class="flex flex-col">
      <ma-classic-header />
      <ma-worker-area />
    </a-layout-content>
    
  </a-layout>
</template>

<script setup>
import { ref } from 'vue'

import maClassicSider from './ma-classic-sider.vue'
import maClassicHeader from './ma-classic-header.vue'
import maWorkerArea from '../ma-workerArea.vue'

</script>