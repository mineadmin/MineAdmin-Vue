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
  <a-modal v-model:visible="visible" width="600px" @cancel="close" :footer="false">
    <template #title>{{ $t('sys.changeSkin') }}</template>
    <div class="flex flex-col">
      <a-card
        v-for="(item, index) in skinList"
        :key="item.name"
        :class="index === 0 ? '' : 'mt-3'"
        :body-style="{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px' }"
      >
        <a-row class="w-full flex items-center">
          <a-col :span="3" class="flex flex-col text-center">
            <div class="leading-6">{{ $t(`skin.${item.name}`) }}</div>
          </a-col>
          <a-col :span="6" class="flex flex-col text-center">
            <a-image :src="item.thumb" class="rounded border" />
          </a-col>
          <a-col :span="12" class="flex items-center pl-3 pr-3">
            {{ $t(`skin.${item.name}Desc`) }}
          </a-col>
          <a-col :span="3" class="flex items-center justify-end">
            <a-button
              :type="appStore.skin === item.name ? 'primary' : 'secondary'"
              :disabled="appStore.skin === item.name"
              @click="useSkin(item.name)"
            >
              {{ appStore.skin === item.name ? $t('skin.activated') : $t('skin.use') }}
            </a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAppStore } from '@/store'
import skins from '@/config/skins'

const visible = ref(false)
const appStore = useAppStore()

const open = () => visible.value = true
const close = () => visible.value = false

const useSkin = (name) => appStore.useSkin(name)

const skinList = reactive(skins)

defineExpose({ open })
</script>

<style scoped lang="less">
</style>