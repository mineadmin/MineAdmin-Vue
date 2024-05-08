<script setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from "dayjs"
import { discount } from "@/utils/common"
import { getAppList } from "@/api/store.js"
import AppDetail from "@/views/appStore/components/appDetail.vue"

const props = defineProps({
  isHasAccessToken: {
    type: Boolean,
    default: false
  }
})

const loading = ref(false)
const detailRef = ref()

const appList = ref([])
const myAppList = ref([])
const total = ref(0)
const filterParams = reactive({
  page: 1,
  size: 9999,
  keywords: undefined,
  add_type: undefined,
  type: undefined,
  tag: undefined
})

const open = (url) => window.open(url)

const requestAppList = (params = { page: 1, size: 9999 }) => {
  const requestParams = Object.assign(filterParams, params)
  loading.value = true
  getAppList(requestParams).then(res => {
    if (res.code === 200) {
      const { list, rowTotal } = res.data?.data
      appList.value = list
      total.value = rowTotal
      loading.value = false
    }
  })
}

const paramsList = reactive({
  addType: [
    {label: '全部', value: undefined },
    {label: '完整应用', value: 'mixed'},
    {label: '后端应用', value: 'backend'},
    {label: '前端应用', value: 'frontend'}
  ],
  types: [
    {label: '全部', value: undefined },
    {label: '免费应用', value: '0' },
    {label: '积分应用', value: '1' },
    {label: '付费应用', value: '2' }
  ],
  keywords: undefined
})

const filterRequest = (name, item) => {
  if (filterParams[name] === item.value) {
    return true
  }
  filterParams[name] = item.value
  requestAppList()
}

const openDetailModal = async (item) => {
  await detailRef.value.open(item.identifier)
}

onMounted(() => {
  if (!!! props.isHasAccessToken) {
    requestAppList()
  }

  getAppList({ page:1, size: 9999, is_self: 1 }).then(res => {
    if (res.code === 200) {
      res.data?.data?.list.map(item => {
        myAppList.value.push(item.identifier)
      })
    }
  })
})
</script>

<template>
  <div>
    <a-alert>您可以在此页下载喜欢的应用，积分需要签到、做任务或者邀请好友、发布应用等方式获得。注意：只有开发环境才能使用应用市场</a-alert>
    <div class="rounded-md mt-2 flex justify-between">
      <div>
        <a-space>
          <a-button type="primary" status="danger" @click="requestAppList()"><template #icon><icon-refresh /></template></a-button>
          <a-button-group>
            <a-button type="primary" status="warning"><template #icon><icon-upload /></template>上传安装</a-button>
            <a-button type="primary" status="warning"><template #icon><icon-desktop /></template>本地应用</a-button>
          </a-button-group>
          <a-button type="primary" @click="open('https://www.mineadmin.com/member/setting')"><template #icon><icon-user /></template>个人信息</a-button>
        </a-space>
      </div>
      <a-input-search
          placeholder="搜索应用..."
          v-model="paramsList.keywords"
          @press-enter="filterRequest('keywords', { value: paramsList.keywords })"
          @search="filterRequest('keywords', { value: paramsList.keywords })"
          class="w-52"
      />
    </div>
    <div class="sticky card mt-2 -top-4 z-20 backdrop-blur border p-3 border-gray-200 dark:border-0 -mb-px rounded">
      <ul class="leading-8">
        <li class="flex items-center">
          <span>类型：</span>
          <div class="space-x-3 ml-3">
            <a-tag
                checkable color="arcoblue"
                v-for="item in paramsList.addType"
                :checked="filterParams.add_type === item.value" @click="filterRequest('add_type', item)"
            >{{ item.label }}</a-tag>
          </div>
        </li>
        <li class="flex items-center">
          <span>价格：</span>
          <div class="space-x-3 ml-3">
            <a-tag
                checkable color="arcoblue"
                v-for="item in paramsList.types"
                :checked="filterParams.type === item.value" @click="filterRequest('type', item)"
            >{{ item.label }}</a-tag>
          </div>
        </li>
        <!--          <li class="flex items-center">-->
        <!--            <span>标签：</span>-->
        <!--            <div class="space-x-3 ml-3">-->
        <!--              <a-tag checkable color="arcoblue" :default-checked="true">全部</a-tag>-->
        <!--              <a-tag checkable color="arcoblue" :default-checked="false">biaoqian</a-tag>-->
        <!--            </div>  -->
        <!--          </li>-->
      </ul>
    </div>
    <a-empty v-if="appList.length === 0 && !loading" description="暂无应用" class="my-5 mt-20" />
    <a-spin
      :loading="loading"
      tip="加载应用列表中..."
      class="sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-60 -top-5 gap-4 mt-2 md:top-0 sm:top-2 relative md:mt-2.5"
    >
      <div
          class="h-auto relative mt-8 sm:mt-0 border border-gray-150 dark:border-gray-600 hover:border-primary-500 dark:hover:border-gray-400 rounded-md top-0 hover:shadow-md hover:-top-1 dark:shadow-gray-600 transition-all duration-300 group overflow-hidden"
          v-for="(item, idx) in appList"
      >
        <div
          class="absolute z-10 w-auto bg-red-600 text-white px-5 origin-center rotate-45 -right-5 top-2.5"
          v-if="myAppList.includes(item.identifier)"
        >
          已购买
        </div>
        <a class="h-44 w-full" href="javascript:" @click="openDetailModal(item)">
          <div class="relative">
            <img
                class="!rounded-b-none !rounded-t-md pointer-events-none w-full object-cover object-top sm:rounded-md h-60 lg:h-44 xl:h-48 transform transition-transform duration-200 group-hover:scale-105"
                :src="item.homepage[0]"
            />
            <div class="absolute bottom-2 right-2 space-x-2">
              <a-tag :color="tag.color === 'primary' ? 'arcoblue' : tag.color" v-for="tag in item.tags">{{ tag.name }}</a-tag>
            </div>
          </div>
        </a>
        <div class="p-3 pb-2">
          <div class="grid-cols-2 grid">
            <div class="text-sm">
              <a class="hover:underline" href="javascript:" @click="openDetailModal(item)">{{ item.name }}</a>
            </div>
            <div class="text-xs leading-5 text-gray-500 dark:text-gray-400 text-right">
              {{ `${dayjs(item.created_at).fromNow()}更新` }}
            </div>
          </div>
          <div class="text-xs mt-1 text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </div>
          <div class="text-xs mt-5 grid grid-cols-2">
            <div class="leading-6 text-gray-700 dark:text-gray-300"><span class="hover:underline">X.Mo</span></div>
            <div class="text-right">
              <a-tag v-if="item.auth.type === 0" color="green">免费</a-tag>
              <div v-else-if="item.auth.type === 1">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>

    <appDetail ref="detailRef" :myApp="myAppList" />
  </div>
</template>

<style scoped lang="less">
.card {
  background: rgb(var(--ui-background)/.75);
}
</style>