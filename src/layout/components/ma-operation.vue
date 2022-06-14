<template>
  <div class="mr-2 flex justify-end lg:justify-between w-full lg:w-auto">
    <a-space class="mr-0 lg:mr-5" size="medium">

      <a-tooltip content="搜索">
        <a-button :shape="'circle'" class="hidden lg:inline">
          <template #icon>
            <icon-search />
          </template>
        </a-button>
      </a-tooltip>

      <!-- <a-tooltip content="锁屏">
        <a-button :shape="'circle'" class="hidden lg:inline">
          <template #icon>
            <icon-lock />
          </template>
        </a-button>
      </a-tooltip> -->

      <a-tooltip :content="'全屏'">
        <a-button :shape="'circle'" class="hidden lg:inline" @click="screen">
          <template #icon>
            <icon-fullscreen-exit v-if="isFullScreen" />
            <icon-fullscreen v-else />
          </template>
        </a-button>
      </a-tooltip>

      <a-trigger trigger="click">
        <a-button :shape="'circle'">
          <template #icon>
            <a-badge :count="5" dot :dotStyle="{ width: '5px', height: '5px',}">
              <icon-notification />
            </a-badge>
          </template>
        </a-button>

        <template #content>
          <message-notification />
        </template>
      </a-trigger>

      <a-tooltip content="页面设置">
        <a-button :shape="'circle'" @click="setting.open()" class="hidden lg:inline">
          <template #icon>
            <icon-settings />
          </template>
        </a-button>
      </a-tooltip>
      
    </a-space>
    <a-dropdown @select="handleSelect" trigger="hover">

      <a-avatar class="bg-blue-500 text-3xl avatar" style="top: -1px;">
        {{ userStore.user && userStore.user.username[0] }}
      </a-avatar>

      <template #content>
        <a-doption><icon-user /> 个人中心</a-doption>
        <a-doption><icon-delete /> 清除缓存</a-doption>
        <a-divider style="margin: 5px 0" />
        <a-doption><icon-poweroff /> 退出系统</a-doption>
      </template>
    </a-dropdown>

    <Setting ref="setting" />

  </div>
</template>


<script setup>
  import { ref } from 'vue'
  import { useAppStore, useUserStore } from '@/store'
  import tool from '@/utils/tool'
  import Setting from './components/setting.vue'
  import messageNotification from './components/message-notification.vue'

  const userStore = useUserStore()
  const appStore  = useAppStore()
  const setting = ref(null)
  const isFullScreen = ref(false)

  const handleSelect = () => {}

  const screen = () => {
    tool.screen(document.documentElement)
    isFullScreen.value = !isFullScreen.value
  }
  
</script>
<style scoped>
:deep(.arco-avatar-text) {
  top: 1px;
}
:deep(.arco-divider-horizontal) {
  margin: 5px 0;
}
.avatar {
  cursor: pointer; margin-top: 6px;
}
</style>