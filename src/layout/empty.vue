<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <keep-alive :include="keepStore.keepAlives">
        <component :is="Component" :key="$route.name" v-if="keepStore.show" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { useKeepAliveStore } from '@/store'
const keepStore = useKeepAliveStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>