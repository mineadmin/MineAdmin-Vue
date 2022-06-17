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
        <img
          :src="(userStore.user && userStore.user.avatar) ? userStore.user.avatar : '/avatar.jpg'"
        />
      </a-avatar>

      <template #content>
        <a-doption value="userCenter"><icon-user /> 个人中心</a-doption>
        <a-doption value="clearCache"><icon-delete /> 清除缓存</a-doption>
        <a-divider style="margin: 5px 0" />
        <a-doption value="logout"><icon-poweroff /> 退出系统</a-doption>
      </template>
    </a-dropdown>

    <a-modal v-model:visible="showLogoutModal" @ok="handleLogout" @cancel="handleLogoutCancel">
      <template #title>退出提示</template>
      <div>确定要退出登录吗？</div>
    </a-modal>

    <Setting ref="setting" />

  </div>
</template>


<script setup>
  import { ref } from 'vue'
  import { useAppStore, useUserStore } from '@/store'
  import tool from '@/utils/tool'
  import Setting from './components/setting.vue'
  import messageNotification from './components/message-notification.vue'
  import { useRouter } from 'vue-router'

  const userStore = useUserStore()
  const appStore  = useAppStore()
  const setting = ref(null)
  const router = useRouter()
  const isFullScreen = ref(false)
  const showLogoutModal = ref(false)

  const handleSelect = (name) => {
    if (name === 'userCenter') {

    }
    if (name === 'clearCache') {

    }
    if (name === 'logout') {
      showLogoutModal.value = true
      document.querySelector('#app').style.filter = 'grayscale(1)'
    }
  }

  const handleLogout = async () => {
    await userStore.logout()
    document.querySelector('#app').style.filter = 'grayscale(0)'
    router.push({ name: 'login', query: { redirect: router.currentRoute.fullPath } })
  }

  const handleLogoutCancel = () => {
    document.querySelector('#app').style.filter = 'grayscale(0)'
  }

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