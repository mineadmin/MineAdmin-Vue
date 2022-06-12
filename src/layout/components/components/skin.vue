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
            <a-image
              src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp"
              />
           <div class="leading-6">{{ item.title }}</div>
          </a-col>
          <a-col :span="13" class="flex items-center pl-3">
            {{ item.desc }}
          </a-col>
          <a-col :span="3" class="flex items-center justify-end">
            <a-button type="primary" :disabled="appStore.skin === item.name" @click="useSkin(item.name)">使用</a-button>
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
    demoImg: '/skins/mine/thumb.jpg',
  },
  {
    title: '商务灰',
    name: 'businessGray',
    desc: '主要用百搭与大气的灰色，商务、稳重',
    demoImg: '/skins/businessGray/thumb.jpg',
  },
  {
    title: '童年时光',
    name: 'childHood',
    desc: '追寻儿时记忆，享受使用过程',
    demoImg: '/skins/childHood/thumb.jpg',
  }
])

defineExpose({ open })
</script>

<style scoped lang="scss">
</style>