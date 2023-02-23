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
    <template v-for="menu in modelValue" :key="menu.id">
      <template v-if="!menu.meta.hidden">
        <a-menu-item
          v-if="! menu.children || menu.children.length === 0"
          :key="menu.name"
          @click="routerPush(menu)"
        >
          <template #icon v-if="menu.meta.icon">
            <component :is="menu.meta.icon" :class="menu.meta.icon.indexOf('ma') > 0 ? 'icon' : ''" />
          </template>
          {{ appStore.i18n ? ( $t(`menus.${menu.name}`).indexOf('.') > 0 ? menu.meta.title : $t(`menus.${menu.name}`) ) : menu.meta.title }}
        </a-menu-item>
        <a-sub-menu v-else :key="menu.name">
          <template #icon v-if="menu.meta.icon">
            <component :is="menu.meta.icon" :class="menu.meta.icon.indexOf('ma') > 0 ? 'icon' : ''" />
          </template>
          <template #title @click="routerPush(menu.path)">
            {{ appStore.i18n ? ( $t(`menus.${menu.name}`).indexOf('.') > 0 ? menu.meta.title : $t(`menus.${menu.name}`) ) : menu.meta.title }}
          </template>
          <template v-if="menu.children">
            <children-menu v-model="menu.children" />
          </template>
        </a-sub-menu>
      </template>
    </template>
  </a-layout-content>
</template>
<script setup>
  import { useTagStore, useAppStore } from '@/store'
  import { useRouter } from 'vue-router'

  defineProps({ modelValue: Array })

  const router = useRouter()
  const emits  = defineEmits(['go'])
  const appStore = useAppStore()
  const tagStore = useTagStore()

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
  width: 1em; height: 1em; 
}
.arco-menu-selected .icon {
  fill: rgb(var(--primary-6));
}
</style>