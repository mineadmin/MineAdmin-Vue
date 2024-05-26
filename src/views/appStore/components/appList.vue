<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAppList, getPayApp, getLocalAppInstallList } from "@/api/store.js"
import AppDetail from "./appDetail.vue"
import AppComponent from './app.vue'
import { isUndefined } from "lodash"
import { useRoute } from 'vue-router'
import { Message } from "@arco-design/web-vue"
import tool from '@/utils/tool.js'
import { refreshTag } from "@/utils/common.js"

const route = useRoute()

const props = defineProps({
  isHasAccessToken: {
    type: Boolean,
    default: false
  }
})

const token = ref(tool.local.get(import.meta.env.VITE_APP_TOKEN_PREFIX))
const uploadAction = ref(`${import.meta.env.VITE_APP_BASE_URL}/plugin/store/uploadLocalApp`)
const loading = ref(false)
const detailRef = ref()
const isOnlyShowLocalApp = ref(false)
const originalAppList = ref([])
const appList = ref([])
const onlyLocalAppList = ref([])
const myAppList = ref([])
const localInstallList = ref([])
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
      originalAppList.value = list
      onlyLocalAppList.value = originalAppList.value.map(item => {
        if (! isUndefined(localInstallList.value[`${item.space}/${item.identifier}`]) ) {
          return item
        }
      })
      total.value = rowTotal
      loading.value = false
      setAppList()
    }
  })
}

const setAppList = () => {
  if (isOnlyShowLocalApp.value) {
    appList.value = onlyLocalAppList.value
  } else {
    appList.value = originalAppList.value
  }
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

const localOnlyShow = () => {
  isOnlyShowLocalApp.value = ! isOnlyShowLocalApp.value
  setAppList()
}

const uploadAppAndInstall = () => {
  Message.success('本地上传的应用已经安装成功');
  refreshTag()
}

onMounted(() => {
  if (!!! props.isHasAccessToken) {
    requestAppList()
  }

  getPayApp().then(res => {
    if (res.code === 200) {
      myAppList.value = res.data
    }
  })

  getLocalAppInstallList().then(res => {
    if (res.code === 200) {
      localInstallList.value = res.data
    }
  })

  if (route.query?.install) {
    const installQuery = route.query.install.split('/')[1] ?? undefined
    if (installQuery) {
      openDetailModal({ identifier: installQuery })
    } else {
      Message.error(`要安装插件：${route.query.install} 不存在`)
    }
  }
})
</script>

<template>
  <div>
    <a-alert>您可以在此页下载喜欢的应用，积分需要签到、做任务或者邀请好友、发布应用等方式获得。注意：只有开发环境才能使用应用市场</a-alert>
    <div class="rounded-md mt-2 flex justify-between">
      <div>
        <a-space>
          <a-button type="primary" status="danger" @click="requestAppList()"><template #icon><icon-refresh /></template></a-button>
          <a-upload
            :action="uploadAction"
            accept=".zip,.rar"
            name="file"
            :limit="1" :show-file-list="true"
            :headers="{
              Authorization: `Bearer ${token}`,
              // 'Accept-Language': 'zh_CN',
              // 'Content-Type': 'multipart/form-data'
            }"
            @success="uploadAppAndInstall"
            @error="() => Message.error('上传失败')"
          />
          <a-button :type="isOnlyShowLocalApp ? 'outline' : 'primary'" @click="localOnlyShow" status="warning"><template #icon><icon-desktop /></template>本地应用</a-button>
          <a-button status="success" @click="open('https://www.mineadmin.com/member/setting')"><template #icon><icon-user /></template>个人信息</a-button>
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
      <app-component
        :myAppList="myAppList"
        :appList="appList"
        :localInstallList="localInstallList"
        :isOnlyShowLocalApp="isOnlyShowLocalApp"
        @onOpenDetail="openDetailModal"
      />
    </a-spin>

    <appDetail ref="detailRef" :myApp="myAppList" :install-list="localInstallList" />
  </div>
</template>

<style scoped lang="less">
.card {
  background: rgb(var(--ui-background)/.75);
}
</style>