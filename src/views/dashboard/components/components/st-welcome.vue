<template>
  <div class="flex justify-between">
    <div class="ma-content-block rounded-sm flex justify-between w-full p-3">
      <div class="pl-0 flex inline-block">
        <a-avatar :size="75" class="hidden lg:inline-block">
          <img
            :src="
            (userStore.user && userStore.user.avatar)
            ? userStore.user.avatar
            : '/avatar.jpg'"
          />
        </a-avatar>
        <div class="pl-3 mt-2">
          <div class="content-block-title">
            {{ userStore.user.nickname || userStore.user.username }}，欢迎回来！
          </div>
          <div class="leading-5 mt-2">
            欢迎使用MineAdmin后台权限管理系统，系统开源、免费使用。喜欢的请点个 ⭐Star。
          </div>
        </div>
      </div>
      <div class="datetime ml-5 hidden md:block">
        <h2 class="text-3xl text-center">{{ time }}</h2>
        <p class="text-base">{{ day }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store'
  import dayjs from 'dayjs'

  const userStore = useUserStore()

  const time = ref(null)
  const day = ref(null)

  onMounted(() => {
    showTime()
    setInterval(() => showTime(), 1000)
  })

  const showTime = () => {
    time.value = dayjs().format('HH:mm:ss')
    day.value  = dayjs().format('YYYY年MM月DD日')
  }
  
</script>

<style scoped>
.datetime {
  background: rgb(var(--primary-6));
  color: #fff;
  width: 160px;
  text-align: center;
  border-radius: 3px;
  padding: 5px 10px;
}
</style>