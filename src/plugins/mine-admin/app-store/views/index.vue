<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://github.com/mineadmin
-->
<i18n lang="yaml">
zh_CN:
  appstore: 应用商店
  noDevMainTitle: 应用商店无法使用
  noDevSubTitle: 对不起，应用商店只在开发环境开放使用。
  noTokenMainTitle: 未设置 MINE_ACCESS_TOKEN
  noTokenSubTitle: 目前无法获取到应用商店数据，请先设置 MINE_ACCESS_TOKEN。
  checkingTokenMainTitle: 正在检查 MINE_ACCESS_TOKEN
  checkingTokenSubTitle: 正在验证访问令牌，请稍候...
  refreshAppStore: 刷新应用商店
  notFoundApp: 没有找到任何应用
  accessTokenCheckFailTitle: "应用市场无法打开"
  accessTokenCheckFailSubTitle: "可能由以下原因造成："
  accessTokenCheckFailDebug: "检查后端 .env 文件的 APP_DEBUG 是否为 true"
  accessTokenCheckFailLock: "检查后端应用市场插件根目录是否存在 install.lock 文件"
  accessTokenCheckFailRestart: "保证以上条件后，重启后端重试"
zh_TW:
  appstore: 應用商店
  noDevMainTitle: 應用商店無法使用
  noDevSubTitle: 對不起，應用商店僅在開發環境開放使用。
  noTokenMainTitle: 未設置 MINE_ACCESS_TOKEN
  noTokenSubTitle: 目前無法獲取到應用商店數據，請先設置 MINE_ACCESS_TOKEN。
  checkingTokenMainTitle: 正在檢查 MINE_ACCESS_TOKEN
  checkingTokenSubTitle: 正在驗證訪問令牌，請稍候...
  refreshAppStore: 刷新應用商店
  notFoundApp: 沒有找到任何應用
  accessTokenCheckFailTitle: "應用市場無法打開"
  accessTokenCheckFailSubTitle: "可能由以下原因造成："
  accessTokenCheckFailDebug: "檢查後端 .env 文件的 APP_DEBUG 是否為 true"
  accessTokenCheckFailLock: "檢查後端應用市場插件根目錄是否存在 install.lock 文件"
  accessTokenCheckFailRestart: "保證以上條件後，重啟後端重試"
en:
  appstore: App Store
  noDevMainTitle: App Store is not available
  noDevSubTitle: Sorry, the App Store is only open for use in the development environment.
  noTokenMainTitle: MINE_ACCESS_TOKEN is not set
  noTokenSubTitle: Currently unable to retrieve App Store data. Please set MINE_ACCESS_TOKEN first.
  checkingTokenMainTitle: Checking MINE_ACCESS_TOKEN
  checkingTokenSubTitle: Verifying access token, please wait...
  refreshAppStore: Refresh App Store
  notFoundApp: No apps found
  accessTokenCheckFailTitle: "App Store cannot be opened"
  accessTokenCheckFailSubTitle: "Possible causes:"
  accessTokenCheckFailDebug: "Check whether APP_DEBUG in the backend .env file is true"
  accessTokenCheckFailLock: "Check whether install.lock exists in the backend App Store plugin root directory"
  accessTokenCheckFailRestart: "After confirming the above, restart the backend and try again"
</i18n>

<script setup lang="ts">
import { getAppList, getLocalAppInstallList, getPayApp, hasAccessToken } from '../api/app.ts'
import type { TerminalAction, TerminalTask } from '../api/terminal.ts'
import { createTerminalTask } from '../api/terminal.ts'
import AppStoreNotice from './notice.vue'
import AppStoreFilter from './filter.vue'
import AppStoreList from './list.vue'
import AppStoreLocalList from './localList.vue'
import PluginTerminal from '../components/PluginTerminal.vue'

defineOptions({ name: 'MineAppStoreRoute' })

const tabStore = useTabStore()
const { localTrans: t } = useTrans()
const noticeRef = ref()
const appList = ref<any[]>()
const storeMeta = ref<Record<string, any>>({
  isDev: import.meta.env.DEV,
  isHasAccessToken: false,
  hasAccessTokenCheckFailed: false,
  tokenCheckCompleted: false,
  uploadLoading: false,
  loading: false,
  allStore: true,
  total: 0,
})
const dataList = ref<Record<string, any[]>>({
  my: [],
  local: [],
  list: [],
})
const terminalState = reactive({
  visible: false,
  taskNo: '',
  title: '',
})

const filterParams = ref<Record<string, any>>({
  page: 1,
  size: 9999,
  keywords: undefined,
  add_type: undefined,
  type: undefined,
  tag: undefined,
})

function requestAppList(params = { page: 1, size: 9999, created_at_desc: true }) {
  const requestParams = Object.assign(filterParams.value, params)
  storeMeta.value.loading = true
  getAppList(requestParams).then((res: any) => {
    if (res.code === 200) {
      const { list, rowTotal } = res.data?.data
      dataList.value.list = list
      storeMeta.value.total = rowTotal
      storeMeta.value.loading = false
    }
  })
}

async function refreshLocalApps() {
  const res: any = await getLocalAppInstallList()
  if (res.code === 200) {
    dataList.value.local = res.data
  }
}

async function openTerminal(payload: { action: TerminalAction, identifier?: string, version?: string, title?: string }) {
  const res: any = await createTerminalTask({
    action: payload.action,
    identifier: payload.identifier,
    version: payload.version,
  })
  if (res.code === 200) {
    terminalState.taskNo = res.data.task_no
    terminalState.title = payload.title ?? ''
    terminalState.visible = true
  }
}

async function handleTerminalFinished(task: TerminalTask) {
  if (['install', 'uninstall', 'download'].includes(task.action ?? '')) {
    await refreshLocalApps()
    requestAppList()
  }
}

if (storeMeta.value.isDev) {
  hasAccessToken()
    .then((res: any) => {
      storeMeta.value.tokenCheckCompleted = true
      if (res.code === 200) {
        storeMeta.value.isHasAccessToken = res.data.isHas
        if (!res.data.isHas) {
          noticeRef.value?.open?.()
        }
        else {
          requestAppList()
          getPayApp().then((res: any) => {
            if (res.code === 200) {
              dataList.value.my = res.data
            }
          })
          refreshLocalApps()
        }
      }
      else if (res.code === 500) {
        storeMeta.value.hasAccessTokenCheckFailed = true
        storeMeta.value.isHasAccessToken = false
      }
    })
    .catch((err: any) => {
      storeMeta.value.tokenCheckCompleted = true
      storeMeta.value.isHasAccessToken = false
      if (err?.code === 500 || err?.response?.data?.code === 500 || err?.response?.status === 500) {
        storeMeta.value.hasAccessTokenCheckFailed = true
      }
    })
}

provide('storeMeta', storeMeta)
provide('filterParams', filterParams)
provide('dataList', dataList)
provide('appList', appList)
provide('requestAppList', requestAppList)
provide('refreshLocalApps', refreshLocalApps)
provide('openTerminal', openTerminal)
</script>

<template>
  <div class="mine-layout relative top-0">
    <AppStoreNotice ref="noticeRef" />
    <PluginTerminal
      v-model="terminalState.visible"
      :task-no="terminalState.taskNo"
      :title="terminalState.title"
      @finished="handleTerminalFinished"
    />
    <template v-if="storeMeta.isDev && storeMeta.isHasAccessToken">
      <AppStoreFilter />
      <AppStoreList v-if="dataList.list.length > 0 && storeMeta.allStore" />
      <AppStoreLocalList v-if="!storeMeta.allStore" />
      <el-empty v-if="dataList.list.length === 0 && !storeMeta.loading" class="mt-40" :description="t('notFoundApp')" />
    </template>
    <el-result
      v-if="!storeMeta.isDev && !storeMeta.loading"
      class="h-680px"
      icon="warning"
      :title="t('noDevMainTitle')"
      :sub-title="t('noDevSubTitle')"
    />
    <el-result
      v-if="storeMeta.isDev && !storeMeta.tokenCheckCompleted && !storeMeta.loading"
      class="h-680px"
      :title="t('checkingTokenMainTitle')"
      :sub-title="t('checkingTokenSubTitle')"
    >
      <template #icon>
        <el-icon :size="75">
          <ma-svg-icon name="svg-spinners:180-ring" />
        </el-icon>
      </template>
    </el-result>
    <el-result
      v-if="storeMeta.isDev && storeMeta.tokenCheckCompleted && storeMeta.hasAccessTokenCheckFailed && !storeMeta.loading"
      class="h-680px"
      icon="error"
      :title="t('accessTokenCheckFailTitle')"
      :sub-title="t('accessTokenCheckFailSubTitle')"
    >
      <template #extra>
        <div class="mx-auto max-w-560px text-sm leading-7">
          <ol class="m-0 list-disc pl-5 text-left">
            <li>{{ t('accessTokenCheckFailDebug') }}</li>
            <li>{{ t('accessTokenCheckFailLock') }}</li>
          </ol>
          <div class="mt-3 text-gray-500 dark:text-gray-400">
            {{ t('accessTokenCheckFailRestart') }}
          </div>
          <el-button class="mt-5" type="primary" @click="tabStore.refreshTab()">
            {{ t('refreshAppStore') }}
          </el-button>
        </div>
      </template>
    </el-result>
    <el-result
      v-if="storeMeta.isDev && storeMeta.tokenCheckCompleted && !storeMeta.hasAccessTokenCheckFailed && !storeMeta.isHasAccessToken && !storeMeta.loading"
      class="h-680px"
      icon="error"
      :title="t('noTokenMainTitle')"
      :sub-title="t('noTokenSubTitle')"
    >
      <template #extra>
        <el-button type="primary" @click="tabStore.refreshTab()">
          {{ t('refreshAppStore') }}
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped lang="scss">
.mine-appstore-filter {
  @apply sticky top-[56px] z-999 bg-white p-3 dark-bg-dark-8 shadow-md dark-shadow-dark-4 transition-all duration-300;
}

.mine-appstore-list {
  @apply sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-60 gap-4 mt-3 relative;
}
</style>
