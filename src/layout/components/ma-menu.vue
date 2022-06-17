<template>
  <a-menu
    class="ma-menu"
    :style="{ width: appStore.menuWidth + 'px', height: props.height }"
    breakpoint="md"
    :accordion="true"
    :collapsed-width="45"
    show-collapse-button
    :selected-keys="actives"
    :collapsed="appStore.menuCollapse"
    @collapse="onCollapse"
  >
    <children-menu v-model="menus" />
  </a-menu>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  import childrenMenu from './components/children-menu.vue'
  
  import { useAppStore, useUserStore } from '@/store'
  const router = useRouter()
  const route  = useRoute()

  const appStore = useAppStore()
  const userStore = useUserStore()

  const menus = ref([])
  const actives = ref([])
  const openKeys = ref([])
  const title = ref('')

  onMounted(() => {
    userStore.routers.map( item => {
      if (item.children && item.children.length > 0) {
        item.children.filter( r => {
          if (r.name === route.name) {
            openKeys.value = [ item.name ]
            actives.value = [ r.name ]
          }
        })
      }
    })
  })

  watch(() => route, v => {
    actives.value = [ v.name ]
  }, { deep: true })

  const loadChildMenu = (obj, bigIndex = 0, routerIndex = 0) => {
    if (obj.children && obj.children.length > 0) {
      menus.value = obj.children
      title.value = obj.meta.title
    }
  }

  const onCollapse = (val) => {
    appStore.menuCollapse = val
  }

  const props = defineProps({
    height: { type: String, default: '100%' }
  })

  defineExpose({ loadChildMenu, title, actives, menus })
</script>
<style scoped>
:deep(.arco-menu-vertical .arco-menu-inner) {
  padding: 0;
}
:deep(.arco-menu-collapse-button) {
  right: 8px; bottom: 8px;
}
:deep(.arco-menu-inner ::-webkit-scrollbar-thumb) {
  border: 4px solid transparent;
  background-clip: padding-box;
  border-radius: 7px;
  background-color: var(--color-text-4)
}
</style>