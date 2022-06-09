<template>
  <a-layout-sider
    class="layout-classic-sider h-full flex flex-col hidden lg:block"
    :style="`width: ${appStore.menuCollapse ? '55px' : appStore.menuWidth + 'px'};`"
  >
    <div class="flex justify-center logo">
      <a-avatar class="mt-1" :size="40"><img src="/logo.svg" class="bg-white" /></a-avatar>
      <span class="ml-2 text-xl mt-2.5" v-if="! appStore.menuCollapse">MineAdmin</span>
    </div>
    <ma-menu
      ref="MaMenu"
      height="calc(100% - 51px)"
      :class="`${appStore.menuCollapse ? 'ml-1.5' : ''};`"
    />
  </a-layout-sider>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useAppStore, useUserStore } from '@/store'
  import maMenu from '../ma-menu.vue'


  const MaMenu = ref(null)
  const userStore = useUserStore()
  const appStore = useAppStore()

  onMounted(() => {
    setTimeout(_ => {
      MaMenu.value.menus = userStore.routers
    }, 50)
  })
</script>

<style scoped>
.logo { height: 51px; border-bottom: 1px solid var(--color-border-1); }
:deep(.arco-menu-inner){
  overflow-x: hidden !important
}
:deep(.arco-layout-sider-children) {
  overflow-x: hidden;
}
</style>
