<script setup>
import { ref } from 'vue'
import { hasAccessToken, getAppList } from '@/api/store'
import dayjs from 'dayjs'

const isDev = ref(import.meta.env.DEV)
const isHasAccessToken = ref(false)

const appList = ref([])

const imgs = []

for (let i = 1; i <= 40; i++) {
  imgs.push('https://picsum.photos/800/800?random=' + i)
}

const requestApplist = (params = { page: 1, size: 9999 }) => {
  getAppList(params).then(res => {
    if (res.code === 200) {
      appList.value = res.data
    }
  })
}

if (isDev) {
  hasAccessToken().then(res => {
    if (res.code === 200) {
      isHasAccessToken.value = ! res.data.isHas
    }
  })

  if (!!! isHasAccessToken.value) {
    requestApplist()
  }
}
</script>

<template>
  <div class="ma-content-block p-4 h-full overflow-y-auto">
    <a-modal v-model:visible="isHasAccessToken" title="后端未设置 MINE_ACCESS_TOKEN" :mask-closable="false">
      <div class="text-red-600 text-base">请按照以下步骤设置：</div>
      <ol class="leading-7 mt-3">
        <li>1. 进入<a-link target="_blank" href="https://www.mineadmin.com/login?redirect=/member/setting">MineAdmin官网</a-link>设置页面，获取 <span class="text-green-800">AccessToken</span></li>
        <li>2. 打开后端 <span class="text-green-800">.env</span> 配置文件</li>
        <li>3. 添加此行配置：<a-tag color="red">MINE_ACCESS_TOKEN = 获取到的AccessToken</a-tag></li>
        <li>4. 重启后端服务，完成配置</li>
      </ol>
    </a-modal>
    <div v-if="isDev">
      <a-alert>您可以在此页下载喜欢的应用，积分需要签到、做任务或者邀请好友、发布应用等方式获得。注意：只有开发环境才能使用应用市场</a-alert>
      <div class="rounded-md mt-2 flex justify-between">
        <div>
          <a-space>
            <a-button type="primary" status="danger"><template #icon><icon-refresh /></template></a-button>
            <a-button-group>
              <a-button type="primary" status="warning"><template #icon><icon-upload /></template>上传安装</a-button>
              <a-button type="primary" status="warning"><template #icon><icon-desktop /></template>本地应用</a-button>
            </a-button-group>
            <a-button type="primary"><template #icon><icon-user /></template>个人信息</a-button>
          </a-space>
        </div>
        <a-input-search
          placeholder="搜索应用..."
          style="width: 300px"
        />
      </div>
      <div class="sticky card mt-2 -top-4 z-10 backdrop-blur border p-3 border-gray-200 dark:border-0 -mb-px rounded">
        <ul class="leading-8">
          <li class="flex items-center">
            <span>类型：</span>
            <div class="space-x-3 ml-3">
              <a-tag checkable color="arcoblue" :default-checked="true">全部</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">完整应用</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">后端应用</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">前端应用</a-tag>
            </div>
          </li>
          <li class="flex items-center">
            <span>价格：</span>
            <div class="space-x-3 ml-3">
              <a-tag checkable color="arcoblue" :default-checked="true">全部</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">免费应用</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">积分应用</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">收费应用</a-tag>
            </div>  
          </li>
          <li class="flex items-center">
            <span>标签：</span>
            <div class="space-x-3 ml-3">
              <a-tag checkable color="arcoblue" :default-checked="true">全部</a-tag>
              <a-tag checkable color="arcoblue" :default-checked="false">biaoqian</a-tag>
            </div>  
          </li>
        </ul>
      </div>
      <!-- <a-empty v-if="appList.length === 0" description="暂无应用" class="my-5" /> -->
      <div class="sm:grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-2 -top-5 md:top-0 relative md:mt-2.5">
        <div
            class="h-auto mt-8 sm:mt-0 border border-gray-150 dark:border-gray-600 hover:border-primary-500 dark:hover:border-gray-400 rounded-md top-0 hover:shadow-md hover:-top-1 dark:shadow-gray-600 transition-all duration-300 group overflow-hidden"
            v-for="(item, idx) in 40"
        >
          <a class="h-44 w-full">
            <div class="relative">
              <img
                class="!rounded-b-none !rounded-t-md pointer-events-none w-full object-cover object-top sm:rounded-md h-60 transform transition-transform duration-200 group-hover:scale-105"
                :src="imgs[item]"
              />
              <div class="absolute bottom-2 right-2 space-x-2">
                <a-tag v-for="tag in 2">{{ tag }}</a-tag>
              </div>
            </div>
          </a>
          <div class="p-3 pb-2">
            <div class="grid-cols-2 grid">
              <div class="text-sm">
                <a class="hover:underline">测试</a>
              </div>
              <div class="text-xs leading-5 text-gray-500 dark:text-gray-400 text-right">
                {{ `3分钟前更新` }}
              </div>
            </div>
            <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">
              描述
            </div>
            <div class="text-xs mt-5 grid grid-cols-2">
              <div class="leading-6 text-gray-700 dark:text-gray-300"><a class="hover:underline">X.Mo</a></div>
              <div class="text-right">
                <a-tag color="green">免费</a-tag>
                <!-- <div v-else-if="item.auth.type === 1">
                  <div class="flex items-center justify-end leading-6">
                    <div class="line-through text-gray-400" v-if="item.auth.integral_discount !== '0.00'">{{ item.auth.integral_quota }} 积分</div>
                    <div class="ml-2 text-emerald-700">{{ discount(item.auth.integral_discount, item.auth.integral_quota) }} 积分</div>
                  </div>
                </div>
                <div v-else-if="item.auth.type === 2">
                  <div class="flex items-center justify-end leading-6">
                    <div class="line-through text-gray-400" v-if="item.auth.basic_discount !== '0.00'">￥{{ item.auth.basic_quota }}</div>
                    <div class="ml-2 text-blue-600">￥{{ discount(item.auth.basic_discount, item.auth.basic_quota) }}</div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <a-result status="info" title="说明">
        <template #subtitle>
          应用市场只在开发环境开放使用。
        </template>
      </a-result>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgb(var(--ui-background)/.75);
}
</style>
<script>export default { name: 'store' }</script>