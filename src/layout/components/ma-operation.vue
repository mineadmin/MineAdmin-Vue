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

      <a-tooltip content="锁屏">
        <a-button :shape="'circle'" class="hidden lg:inline">
          <template #icon>
            <icon-lock />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip :content="'全屏'">
        <a-button :shape="'circle'" class="hidden lg:inline">
          <template #icon>
            <icon-fullscreen />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="消息通知">
        <a-button :shape="'circle'">
          <template #icon>
            <icon-notification />
          </template>
        </a-button>
      </a-tooltip>

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

  import Setting from './components/setting.vue'

  const userStore = useUserStore()
  const appStore  = useAppStore()
  const setting = ref(null)

  const handleSelect = () => {}
  
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