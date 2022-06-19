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
    width="350px"
    :ok-text="$t('sys.saveToBackend')"
    :ok-loading="okLoading"
    @cancel="close"
    unmountOnClose
  >
    <template #title>{{ $t('sys.backendSettingTitle') }}</template>
    <a-form :model="form" :auto-label-width="true">
      <a-form-item :label="$t('sys.skin')" :help="$t('sys.skinHelp')">
        {{ currentSkin }} 
        <a-button type="primary" status="success" size="mini" class="ml-2" @click="skin.open()">
          {{ $t('sys.changeSkin')}}
        </a-button>
      </a-form-item>
      <a-form-item :label="$t('sys.layouts')" :help="$t('sys.layoutsHelp')">
        <a-select v-model="form.layout" size="mini" @change="handleLayout">
          <a-option value="classic">{{ $t('sys.layout.classic') }}</a-option>
          <a-option value="columns">{{ $t('sys.layout.columns') }}</a-option>
          <a-option value="banner">{{ $t('sys.layout.banner') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.language')" :help="$t('sys.languageHelp')">
        <a-select v-model="form.language" size="mini" @change="handleLanguage">
          <a-option value="zh_CN">{{ $t('sys.chinese') }}</a-option>
          <a-option value="en">{{ $t('sys.english') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.dark')" :help="$t('sys.darkHelp')">
        <a-switch type="line" v-model="form.mode" @change="handleSettingMode" />
      </a-form-item>
      <a-form-item :label="$t('sys.tag')" :help="$t('sys.tagHelp')">
        <a-switch type="line" v-model="form.tag" @change="handleSettingTag" />
      </a-form-item>
      <a-form-item v-if="form.layout !== 'banner'" :label="$t('sys.menuFold')" :help="$t('sys.menuFoldHelp')">
        <a-switch type="line" v-model="form.menuCollapse" @change="handleMenuCollapse" />
      </a-form-item>
      <a-form-item v-if="form.layout !== 'banner'" :label="$t('sys.menuWidth')" :help="$t('sys.menuWidthHelp')">
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
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const appStore  = useAppStore()
const { t } = useI18n()

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
  if (item.name === appStore.skin) currentSkin.value = t('skin.' + item.name)
})

watch(() => appStore.skin, v => {
  skins.map(item => {
    if (item.name === v) currentSkin.value = t('skin.' + item.name)
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


