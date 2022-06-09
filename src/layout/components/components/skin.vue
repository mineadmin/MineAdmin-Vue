<template>
  <a-modal v-model:visible="visible" @ok="save" @cancel="close">
    <template #title>换肤</template>
    <div class="flex flex-col">
      <a-card
        v-for="item in skinList"
        :key="item.name"
        class="mt-3"
      >
        {{ item.title }}
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

const save = () => {
  
}

const skinList = reactive([
  {
    title: 'Mine',
    name: 'mine',
    desc: '官方皮肤，以纯净白色为主，可使用黑夜模式。',
    demoImg: '/skins/mine/thumb.jpg',
  },
  {
    title: '商务灰',
    name: 'businessGray',
    desc: '官方皮肤，主要用百搭与大气的灰色为主，突出商务风格。',
    demoImg: '/skins/businessGray/thumb.jpg',
  },
  {
    title: '童年时光',
    name: 'childHood',
    desc: '官方皮肤，主要用百搭与大气的灰色为主，突出商务风格。',
    demoImg: '/skins/childHood/thumb.jpg',
  }
])

defineExpose({ open })
</script>

<style scoped lang="scss">
:deep(.arco-modal-body) {
  padding: 0 10px 10px 10px;
}
</style>