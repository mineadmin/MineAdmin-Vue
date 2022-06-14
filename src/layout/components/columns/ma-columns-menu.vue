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
  <div class="sider flex flex-col items-center bg-gray-800 dark:border-blackgray-5">
    <a-avatar class="mt-2" :size="40"><img src="/logo.svg" class="bg-white" /></a-avatar>
    <ul class="mt-1 parent-menu-container">
      <template
        v-for="(bigMenu, index) in userStore.routers"
        :key="index"
      >
        <li
          :class="`${classStyle}`"
          @click="loadMenu(bigMenu, index)"
        >
          <component v-if="bigMenu.meta.icon" :is="bigMenu.meta.icon" class="text-xl mt-1" />
          <span class="mt-0.5">{{ bigMenu.meta.title }}</span>
        </li>
      </template>
    </ul>
  </div>
  <div class="layout-menu shadow flex flex-col">
    <div class="menu-title flex items-center" v-show="! appStore.menuCollapse">{{ title }}</div>
    <a-layout-sider
      :style="
        `width: ${appStore.menuCollapse ? '45px' : appStore.menuWidth + 'px'};
        height: ${appStore.menuCollapse ? '100%' : 'calc(100% - 51px)'};`"
      >
      <ma-menu ref="MaMenu" :class="appStore.menuCollapse ? 'ml-0.5' : ''" />
    </a-layout-sider>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import maMenu from '../ma-menu.vue'

  import { useAppStore, useUserStore } from '@/store'
  const route = useRoute()

  const MaMenu = ref(null)
  const userStore = useUserStore()
  const appStore = useAppStore()
  
  const title = ref('')

  const classStyle = ref('flex flex-col parent-menu items-center rounded mt-1 text-gray-200 hover:bg-gray-700 hover:text-white dark:hover:text-gray-50 dark:hover:bg-blackgray-1')

  onMounted(() => {
    setTimeout(() => {
      userStore.routers.map((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.filter( (r, idx) => {
            if (r.name === route.name) loadMenu(userStore.routers[index], index, idx)
          })
        }
      })
    }, 50)
  })

  const loadMenu = (bigMenu, index, idx = 0) => {
    MaMenu.value.loadChildMenu(bigMenu, index, idx)
    title.value = MaMenu.value.title
    document.querySelectorAll('.parent-menu').forEach( (item, id) => {
      index !== id ? item.classList.remove('active') : item.classList.add('active')
    })
  }
</script>

<style>
.parent-menu-container {
  width: 62px;
}
.parent-menu {
  width: 62px; padding: 5px; height: 57px; cursor: pointer; font-size: 13px;
  fill: #fff; transition: all .2s;
}
.parent-menu.active {
  background: rgb(var(--primary-6)); color: #fff;
}
:deep(.arco-menu-vertical .arco-menu-inner) {
  padding: 4px;
}
:deep(.arco-menu-vertical .arco-menu-item) {
  padding: 0px 9px; line-height: 36px;
}
</style>