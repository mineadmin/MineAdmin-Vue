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
  <a-drawer
    class="backend-setting"
    :visible="visible"
    @ok="save"
    width="280px"
    ok-text="保存到后台"
    :ok-loading="okLoading"
    @cancel="close"
    unmountOnClose
  >
    <template #title>后台配置</template>
    <a-form :model="form" :auto-label-width="true">
      <a-form-item label="当前皮肤" help="设置后台皮肤">
        {{ currentSkin }} 
        <a-button type="primary" status="success" size="mini" class="ml-2" @click="skin.open()">换肤</a-button>
      </a-form-item>
      <a-form-item label="后台布局" help="设置后台显示方式">
        <a-select v-model="form.layout" size="mini" @change="handleLayout">
          <a-option value="classic">经典</a-option>
          <a-option value="columns">分栏</a-option>
          <a-option value="banner">通栏</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="语言" help="设置页面语言和请求后台语言">
        <a-select v-model="form.language" size="mini" @change="handleLanguage">
          <a-option value="zh_CN">中文</a-option>
          <a-option value="en">英文</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="暗黑模式" help="设置页面显示模式">
        <a-switch type="line" v-model="form.mode" @change="handleSettingMode" />
      </a-form-item>
      <a-form-item label="多标签模式" help="是否启用多标签方式">
        <a-switch type="line" v-model="form.tag" @change="handleSettingTag" />
      </a-form-item>
      <a-form-item label="菜单折叠" help="系统左侧菜单是否折叠起来">
        <a-switch type="line" v-model="form.menuCollapse" @change="handleMenuCollapse" />
      </a-form-item>
      <a-form-item label="菜单宽度" help="设置左侧菜单的显示宽度">
        <a-input-number size="mini" v-model="form.menuWidth" mode="button" @change="handleMenuWidth" />
      </a-form-item>
    </a-form>
  </a-drawer>

  <Skin ref="skin" />
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import Skin from './skin.vue'
import skins from '@/config/skins'

const userStore = useUserStore()
const appStore  = useAppStore()

const skin = ref(null)
const visible = ref(false)
const okLoading = ref(false)
const currentSkin = ref('')
const form = reactive({
  mode: appStore.mode === 'dark',
  tag: appStore.tag,
  menuCollapse: appStore.menuCollapse,
  menuWidth: appStore.menuWidth,
  layout: appStore.layout,
  language: appStore.language
})

skins.map(item => {
  if (item.name === appStore.skin) currentSkin.value = item.title
})

watch(() => appStore.skin, v => {
  skins.map(item => {
    if (item.name === v) currentSkin.value = item.title
  })
})

const open = () => visible.value = true
const close = () => visible.value = false

const handleLayout = (val) => appStore.changeLayout(val)
const handleLanguage = (val) => appStore.changeLanguage(val)
const handleSettingMode = (val) => appStore.toggleMode(val ? 'dark' : 'light')
const handleSettingTag = (val) => appStore.toggleTag(val)
const handleMenuCollapse = (val) => appStore.toggleMenu(val)
const handleMenuWidth = (val) => appStore.changeMenuWidth(val)

watch(() => appStore.menuCollapse, val => form.menuCollapse = val)

const save = () => {

}

defineExpose({ open })
</script>


