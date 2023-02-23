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
    v-model:visible="visible"
    :on-before-ok="save"
    width="350px"
    :ok-text="$t('sys.saveToBackend')"
    @cancel="close"
    unmountOnClose
  >
    <template #title>{{ $t('sys.backendSettingTitle') }}</template>
    <a-form :model="form" :auto-label-width="true">
      <a-row class="flex justify-center mb-5">
        <a-divider orientation="center"><span class="title">{{ $t('sys.systemPrimaryColor') }}</span></a-divider>
        <ColorPicker
          theme="dark"
          :color="appStore.color"
          :sucker-hide="true"
          :colors-default="defaultColorList"
          @changeColor="changeColor"
          style="width: 218px;"
        />
      </a-row>
      <a-divider orientation="center"><span class="title">{{ $t('sys.personalizedConfig') }}</span></a-divider>
      <a-form-item :label="$t('sys.skin')" :help="$t('sys.skinHelp')">
        {{ currentSkin }} 
        <a-button type="primary" status="success" size="mini" class="ml-2" @click="skin.open()">
          {{ $t('sys.changeSkin')}}
        </a-button>
      </a-form-item>
      <a-form-item :label="$t('sys.layouts')" :help="$t('sys.layoutsHelp')">
        <a-select v-model="form.layout" @change="handleLayout">
          <a-option value="classic">{{ $t('sys.layout.classic') }}</a-option>
          <a-option value="columns">{{ $t('sys.layout.columns') }}</a-option>
          <a-option value="banner">{{ $t('sys.layout.banner') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.i18n')" :help="$t('sys.i18nHelp')">
        <a-switch v-model="form.i18n" @change="handleI18n" />
      </a-form-item>
      <a-form-item :label="$t('sys.language')" :help="$t('sys.languageHelp')" v-if="form.i18n">
        <a-select v-model="form.language" @change="handleLanguage">
          <a-option value="zh_CN">{{ $t('sys.chinese') }}</a-option>
          <a-option value="en">{{ $t('sys.english') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.animation')" :help="$t('sys.animationHelp')">
        <a-select v-model="form.animation" @change="handleAnimation">
          <a-option value="ma-fade">{{ $t('sys.animate.fade') }}</a-option>
          <a-option value="ma-slide-left">{{ $t('sys.animate.sliderLeft') }}</a-option>
          <a-option value="ma-slide-right">{{ $t('sys.animate.sliderRight') }}</a-option>
          <a-option value="ma-slide-down">{{ $t('sys.animate.sliderDown') }}</a-option>
          <a-option value="ma-slide-up">{{ $t('sys.animate.sliderUp') }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('sys.dark')" :help="$t('sys.darkHelp')" v-if="currentSkin === 'Mine'">
        <a-switch v-model="form.mode" @change="handleSettingMode" />
      </a-form-item>
      <a-form-item :label="$t('sys.tag')" :help="$t('sys.tagHelp')">
        <a-switch v-model="form.tag" @change="handleSettingTag" />
      </a-form-item>
      <a-form-item v-if="form.layout !== 'banner'" :label="$t('sys.menuFold')" :help="$t('sys.menuFoldHelp')">
        <a-switch v-model="form.menuCollapse" @change="handleMenuCollapse" />
      </a-form-item>
      <a-form-item v-if="form.layout !== 'banner'" :label="$t('sys.menuWidth')" :help="$t('sys.menuWidthHelp')">
        <a-input-number v-model="form.menuWidth" mode="button" @change="handleMenuWidth" />
      </a-form-item>
    </a-form>
  </a-drawer>

  <Skin ref="skin" />
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import { Message } from '@arco-design/web-vue'
import user from '@/api/system/user'
import Skin from './skin.vue'
import skins from '@/config/skins'
import { useI18n } from 'vue-i18n'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

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
  language: appStore.language,
  animation: appStore.animation,
  i18n: appStore.i18n,
})

const defaultColorList = reactive([
  '#165DFF', '#F53F3F', '#F77234', '#F7BA1E', '#00B42A', '#14C9C9', '#3491FA',
  '#722ED1', '#F5319D', '#D91AD9', '#34C759', '#43a047', '#7cb342', '#c0ca33',
  '#86909c', '#6d4c41',
])
const changeColor = (color) => {
  appStore.changeColor(color.hex)
}

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
const handleI18n = (val) => appStore.toggleI18n(val)
const handleLanguage = (val) => appStore.changeLanguage(val)
const handleAnimation = (val) => appStore.changeAnimation(val)
const handleSettingMode = (val) => appStore.toggleMode(val ? 'dark' : 'light')
const handleSettingTag = (val) => appStore.toggleTag(val)
const handleMenuCollapse = (val) => appStore.toggleMenu(val)
const handleMenuWidth = (val) => appStore.changeMenuWidth(val)

watch(() => appStore.menuCollapse, val => form.menuCollapse = val)

const save = async (done) => {
  const data = {
    mode: appStore.mode,
    tag: appStore.tag,
    menuCollapse: appStore.menuCollapse,
    menuWidth: appStore.menuWidth,
    layout: appStore.layout,
    skin: appStore.skin,
    i18n: appStore.i18n,
    language: appStore.language,
    animation: appStore.animation,
    color: appStore.color
  }

  user.updateInfo({ id: userStore.user.id, backend_setting: data }).then(res => {
    res.success && Message.success(res.message)
  })
  done(true)
}

defineExpose({ open })
</script>


