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
    <mixed-layout v-if="appStore.layout === 'mixed'" />

    <setting ref="settingRef"/>

    <transition name="ma-slide-down" mode="out-in">
      <system-search ref="systemSearchRef" v-show="appStore.searchOpen" />
    </transition>

    <ma-button-menu />

    <div class="max-size-exit" @click="tagExitMaxSize"><icon-close /></div>
  </a-layout-content>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useAppStore, useUserStore } from '@/store'

  import ColumnsLayout from './components/columns/index.vue'
  import ClassicLayout from './components/classic/index.vue'
  import BannerLayout from './components/banner/index.vue'
  import MixedLayout from './components/mixed/index.vue'
  import Setting from './setting.vue'
  import SystemSearch from './search.vue'
  import MaButtonMenu from './components/ma-buttonMenu.vue'

  const appStore = useAppStore()
  const userStore = useUserStore()

  const settingRef = ref()
  const systemSearchRef = ref()
  watch(() => appStore.settingOpen, vl => {
    if (vl === true) {
      settingRef.value.open()
      appStore.settingOpen = false
    }
  })

  const tagExitMaxSize = () => {
    document.getElementById('app').classList.remove('max-size')
  }

  onMounted(() => {
    document.addEventListener('keydown', e => {
      const keyCode = e.keyCode ?? e.which ?? e.charCode
      const altKey = e.altKey ?? e.metaKey
      if(altKey && keyCode === 83) {
        appStore.searchOpen =  true
        return
      }

      if (keyCode === 27) {
        appStore.searchOpen = false
        return
      }
    })
  })

</script>
<style scoped lang="less">
</style>
