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
  <a-layout-content class="h-full main-container">
    <columns-layout v-if="appStore.layout === 'columns'" />
    <classic-layout v-if="appStore.layout === 'classic'" />
    <banner-layout v-if="appStore.layout === 'banner'" />

    <setting ref="settingRef"/>

    <ma-button-menu />

    <div class="max-size-exit" @click="tagExitMaxSize"><icon-close /></div>
  </a-layout-content>
</template>
<script setup>
  import { ref, watch } from 'vue'
  import { useAppStore, useUserStore } from '@/store'

  import ColumnsLayout from './components/columns/index.vue'
  import ClassicLayout from './components/classic/index.vue'
  import BannerLayout from './components/banner/index.vue'
  import Setting from './setting.vue'
  import MaButtonMenu from './components/ma-buttonMenu.vue'

  const appStore = useAppStore()
  const userStore = useUserStore()

  const settingRef = ref()

  watch(() => appStore.settingOpen, vl => {
    if (vl === true) {
      settingRef.value.open()
      appStore.settingOpen = false
    }
  })

  const tagExitMaxSize = () => {
    document.getElementById('app').classList.remove('max-size')
  }

</script>
<style scoped lang="less">
</style>
