<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
    <a-layout-content class="sys-menus">
      <a-menu ref="MaMenuRef" mode="horizontal" class="layout-banner-menu hidden lg:flex" :popup-max-height="360"
        :selected-keys="actives">
        <template v-for="menu in modelValue" :key="menu.id">
          <template v-if="!menu.meta.hidden">
          <template v-if="! menu.children || menu.children.length === 0">
            <!-- 没有子菜单的进入 -->
            <a-menu-item :key="menu.name" @click="routerPush(menu)">
              <template #icon v-if="menu.meta.icon">
                <component :is="menu.meta.icon" :class="menu.meta.icon.indexOf('ma') > 0 ? 'icon' : ''" />
              </template>
              {{ appStore.i18n ? ( $t(`menus.${menu.name}`).indexOf('.') > 0 ? menu.meta.title : $t(`menus.${menu.name}`) ) : menu.meta.title }}
            </a-menu-item>
          </template>
          <!-- 有子菜单的进入 -->
          <template v-else>
            <SubMenu :menu-info="menu" />
          </template>
        </template>
        </template>
      </a-menu>
    </a-layout-content>
  </template>
  <script setup>
    import { ref, watch, onMounted } from 'vue'
    import { useTagStore, useAppStore } from '@/store'
    import { useRouter, useRoute } from 'vue-router'
    import SubMenu from './sub-menu.vue'
    defineProps({ modelValue: Array })
    const router = useRouter()
    const emits = defineEmits(['go'])
    const appStore = useAppStore()
    const tagStore = useTagStore()
    const route = useRoute()
    const actives = ref([])
    onMounted(() => {
      actives.value = [route.name]
    })
  
    watch(() => route, v => {
      actives.value = [v.name]
    }, { deep: true })
    const routerPush = (menu) => {
      if (menu.meta && menu.meta.type === 'L') {
        window.open(menu.path)
      } else {
        router.push(menu.path)
        tagStore.addTag({ name: menu.name, title: menu.meta.title, path: menu.path })
      }
    }
  
  </script>
  
  <style>
    .sys-menus .icon {
      width: 1em;
      height: 1em;
    }
  
    .arco-menu-selected .icon {
      fill: rgb(var(--primary-6));
    }
  </style>