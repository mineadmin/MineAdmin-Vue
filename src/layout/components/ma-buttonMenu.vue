<template>
  <div class="block lg:hidden button-menu">
    <a-trigger
      :trigger="['click']"
      clickToClose
      position="top"
      v-model:popupVisible="popupVisible"
    >
      <div :class="`button-trigger ${popupVisible ? 'button-trigger-active' : ''}`">
        <icon-close v-if="popupVisible" />
        <icon-menu v-else />
      </div>
      <template #content>
        <a-menu mode="popButton" showCollapseButton :popup-max-height="360">
          <children-menu v-model="userStore.routers" />
        </a-menu>
      </template>
    </a-trigger>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore, useUserStore } from '@/store'

import ChildrenMenu from './components/children-menu.vue'

const userStore = useUserStore()
const popupVisible = ref(false)

</script>

<style scoped>

</style>
