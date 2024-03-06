<template>
  <a-menu
    class="ma-menu"
    :style="{ width: appStore.menuWidth + 'px', height: props.height }"
    breakpoint="md"
    v-model:open-keys="openKeys"
    v-model:selected-keys="actives"
    :accordion="true"
    :collapsed-width="45"
    show-collapse-button
    :collapsed="appStore.menuCollapse"
    @collapse="onCollapse"
    :popup-max-height="360"
    auto-scroll-into-view
  >
    <children-menu v-model="menus" />
  </a-menu>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import ChildrenMenu from './components/children-menu.vue'

  import { useAppStore, useUserStore } from '@/store'
  const router = useRouter()
  const route  = useRoute()
  const { t } = useI18n()

  const appStore = useAppStore()
  const userStore = useUserStore()

  const menus = ref([])
  const actives = ref([])
  const openKeys = ref([])
  const title = ref('')

  onMounted(() => {
    actives.value = [ route.name ]
    findTopMenuName()
  })

  watch(() => route, v => {
    actives.value = [ v.name ]
    findTopMenuName()
  }, { deep: true })

  const loadChildMenu = (obj) => {
    if (obj.children && obj.children.length > 0) {
      menus.value = obj.children
      if (! appStore.i18n) {
        title.value = obj.meta.title
      } else {
        title.value = t('menus.' + obj.name).indexOf('.') > 0 ? obj.meta.title : t('menus.' + obj.name)
      }
    }
  }

  const findTopMenuName = () => {
    if (route.matched[1] && route.matched[1].meta && ! route.matched[1].meta.breadcrumb) {
      openKeys.value = []
      route.matched.map((item, index) => {
        if (route.matched[0].name === 'layout') {
          openKeys.value.push('home')
        }
      })
    } else {
      openKeys.value = []
      if (route.matched[1] && route.matched[1].meta) {
        route.matched[1].meta.breadcrumb.map(item => {
          openKeys.value.push(item.name)
        })
      }
    }
  }

  const onCollapse = (val) => {
    appStore.toggleMenu(val)
  }

  const props = defineProps({
    height: { type: String, default: '100%' }
  })

  defineExpose({ loadChildMenu, title, actives, menus, openKeys, findTopMenuName })
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
