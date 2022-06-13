<template>
  <a-modal v-model:visible="visible" width="600px" @cancel="close" :footer="false">
    <template #title>换肤</template>
    <div class="flex flex-col">
      <a-card
        v-for="(item, index) in skinList"
        :key="item.name"
        :class="index === 0 ? '' : 'mt-3'"
        :body-style="{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px' }"
      >
        <a-row class="w-full flex items-center">
          <a-col :span="8" class="flex flex-col text-center">
            <a-image :src="item.demoImg" />
            <div class="leading-6">{{ item.title }}</div>
          </a-col>
          <a-col :span="13" class="flex items-center pl-3">
            {{ item.desc }}
          </a-col>
          <a-col :span="3" class="flex items-center justify-end">
            <a-button
              :type="appStore.skin === item.name ? 'primary' : 'secondary'"
              :disabled="appStore.skin === item.name"
              @click="useSkin(item.name)"
            >
              {{ appStore.skin === item.name ? '已激活' : '使用' }}
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

const visible = ref(false)
const appStore = useAppStore()

const open = () => visible.value = true
const close = () => visible.value = false

const useSkin = (name) => appStore.useSkin(name)

const skinList = reactive([
  {
    title: 'Mine',
    name: 'mine',
    desc: '以纯净的白色为主，Mine默认皮肤',
    demoImg: '/src/style/skins/mine/thumb.jpg',
  },
  {
    title: '商务灰',
    name: 'businessGray',
    desc: '灰色的百搭与大气，营造商务与稳重',
    demoImg: '/src/style/skins/businessGray/thumb.jpg',
  },
  {
    title: '城市',
    name: 'city',
    desc: '愿城市每一个角度，都有一份温馨',
    demoImg: '/src/style/skins/city/thumb.jpg',
  }
])

defineExpose({ open })
</script>

<style scoped lang="scss">
</style>