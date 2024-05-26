<script setup>
import { ref } from 'vue'
import { download, install, unInstall, getDetail } from "@/api/store"
import { discount, versionCompare } from "@/utils/common"
import dayjs from "dayjs"
import { useAppStore } from "@/store"
import { MdPreview } from 'md-editor-v3'
import './style/preview.css'
import { Message } from "@arco-design/web-vue"
import {isUndefined} from "lodash";

const props = defineProps({
  myApp: Array,
  installList: Object,
})

const appStore = useAppStore()
const installBtnDefaultText = '下载并安装此应用'
const unInstallBtnDefaultText = ref('卸载此应用')
const updateBtnDefaultText = ref('更新应用')

const visible = ref(false)
const loading = ref(false)
const isInstall = ref(false)
const isUpdated = ref(false)
const installButtonText = ref(installBtnDefaultText)
const buttonLoading = ref(false)
const data = ref({
  version: []
})
const open = (identifier) => {
  visible.value = true
  loading.value = true
  buttonLoading.value = false
  getDetail({ identifier }).then(res => {
    loading.value = false
    data.value = res.data.data
    const key = `${data.value.created_by.space}/${data.value.app.identifier}`
    if (checkInstallStatus(key)) {
      isInstall.value = true
    }
    if (props.installList[key]) {
      if (versionCompare(props.installList[key].version, data.value.version[0].version) < 0) {
        isUpdated.value = true
      }
    }
  })
}

const checkInstallStatus = (name) => {
  return !isUndefined(props.installList[name]) && props.installList[name].status
}

const openPage = () => {
  window.open('https://www.mineadmin.com/store/' + data.value.app.identifier)
}

const downloadAndInstall = async () => {
  if (! data.value) {
    Message.error('获取应用信息失败，无法安装，重新打开应用详情获取数据后再试')
    return false
  }

  const body = {
    space: data.value.created_by.space,
    identifier: data.value.app.identifier,
    version: data.value.version[0].version,
  }

  buttonLoading.value = true
  installButtonText.value = '应用下载中...'
  const downloadRes = download(body).then(async _ => {
    Message.success('应用下载成功，现在开始安装...')
  }).catch(e => {
    return false
  })

  if (await downloadRes === false) {
    Message.error('应用下载失败')
    installButtonText.value = installBtnDefaultText
    buttonLoading.value = false
    return false
  }

  installButtonText.value = '安装应用中...'
  const installRes = install(body).then(_ => {
    Message.success('应用安装成功，请手动重启后端服务')
    buttonLoading.value = false
    isInstall.value = true
  }).catch(e => {
    return false
  })

  if (await installRes === false) {
    Message.error('应用安装失败')
    installButtonText.value = installBtnDefaultText
    buttonLoading.value = false
    return false
  }

}

const unInstallApp = () => {
  if (! data.value) {
    Message.error('获取应用信息失败，无法卸载，重新打开应用详情获取数据后再试')
    return false
  }

  const body = {
    space: data.value.created_by.space,
    identifier: data.value.app.identifier,
    version: data.value.version[0].version,
  }

  buttonLoading.value = true
  unInstallBtnDefaultText.value = '应用卸载中...'
  unInstall(body).then(_ => {
    Message.success('应用卸载成功')
    buttonLoading.value = false
    isInstall.value = false
  }).catch(e => {
    return false
  })

}

const updatedApp = () => {
  if (! data.value) {
    Message.error('获取应用信息失败，无法更新，重新打开应用详情获取数据后再试')
    return false
  }
}
defineExpose({ open })
</script>

<template>
  <a-drawer
    v-model:visible="visible"
    :title="data?.app?.name ?? '获取中...'"
    width="1000px" :footer="false"
    unmount-on-close
  >
    <a-spin tip="获取数据中..." :loading="loading" class="w-full">
      <div class="grid grid-cols-2 gap-5">
        <div>
          <a-carousel
            :style="{
              height: '252px',
              borderRadius: '4px',
            }"
            :auto-play="true"
            indicator-type="line"
            show-arrow="hover"
          >
            <a-carousel-item v-for="image in data?.app?.homepage">
              <img
                :src="image"
                :style="{
                  width: '100%',
                }"
              />
            </a-carousel-item>
          </a-carousel>
          <a-space class="mt-2">
            <a-tag :color="tag.color === 'primary' ? 'arcoblue' : tag.color" v-for="tag in data?.tags">{{ tag.name }}</a-tag>
          </a-space>
        </div>
        <div>
          <div class="text-base font-bold"> {{ data?.app?.name }} </div>

          <a-descriptions :column="1" bordered class="mt-3">
            <a-descriptions-item label="价格">
              <a-tag v-if="data.auth?.type === 0" color="green">免费</a-tag>
              <div v-else-if="data?.auth?.type === 1">
                <div class="flex items-center justify-end leading-6">
                  <div class="line-through text-gray-400" v-if="data?.auth.integral_discount !== '0.00'">{{ data?.auth.integral_quota }} 积分</div>
                  <div class="ml-2 text-emerald-700">{{ discount(data?.auth.integral_discount, data.auth.integral_quota) }} 积分</div>
                </div>
              </div>
              <div v-else-if="data?.auth?.type === 2">
                <div class="flex items-center justify-end leading-6">
                  <div class="line-through text-gray-400" v-if="data?.auth.basic_discount !== '0.00'">￥{{ data?.auth.basic_quota }}</div>
                  <div class="ml-2 text-blue-600">￥{{ discount(data?.auth.basic_discount, data?.auth.basic_quota) }}</div>
                </div>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="授权方式" v-if="data?.auth?.type === 2">一年 / 永久</a-descriptions-item>
            <a-descriptions-item label="应用标识">
              {{ data?.created_by?.space }}/{{ data?.app?.identifier }}
            </a-descriptions-item>
            <a-descriptions-item label="发布日期">
              {{ dayjs(data?.app?.created_at).format("YYYY-MM-DD") }}
            </a-descriptions-item>
            <a-descriptions-item label="更新日期">
              {{ `${dayjs(data?.version[0]?.created_at).fromNow()}更新` }}
            </a-descriptions-item>
            <a-descriptions-item label="下载次数">
              {{ data?.app?.download_count }}
            </a-descriptions-item>
          </a-descriptions>

          <a-button class="mt-4" type="primary" @click="downloadAndInstall" v-if="props.myApp.includes(data?.app?.identifier) && ! isInstall" :loading="buttonLoading">{{ installButtonText }}</a-button>
          <a-space v-else-if="props.myApp.includes(data?.app?.identifier) && isInstall">
            <a-button class="mt-4" type="primary" status="danger" @click="unInstallApp" :loading="buttonLoading">{{ unInstallBtnDefaultText }}</a-button>
            <a-button class="mt-4" type="primary" status="success" v-if="isUpdated" @click="updatedApp" :loading="buttonLoading">{{ updateBtnDefaultText }}</a-button>
          </a-space>
          <a-button class="mt-4" type="primary" @click="openPage" status="success" v-else>购买此应用</a-button>
        </div>
      </div>

      <div class="flex mt-5">
        <a-tabs class="w-9/12" type="rounded">
          <a-tab-pane key="1" title="应用介绍">
            <div class="pr-5">
              <MdPreview
                id="description"
                :modelValue="data?.version[0]?.version_desc"
                :theme="appStore.mode === 'dark' ? 'dark' : 'light'"
                previewTheme="github"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" title="版本更新记录">
            <div v-for="(item, id) in data?.version" class="block lg:flex justify-between my-5">
            <div class="w-full lg:w-2/12 h-auto">
              <div class="text-xl font-semibold">{{ item.version }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-300 space-y-0.5 mt-2">
                <div>{{ data?.created_by?.username }}</div>
                <div>发布于 {{ `${dayjs(item.created_at).fromNow()}` }}</div>
              </div>
            </div>
            <div class="w-full lg:w-10/12 mt-5 p-3 lg:mt-0 border dark:border-gray-700 rounded-lg">
              <div class="flex justify-between border-b pb-2 dark:border-gray-700">
                <div class="flex">
                  <div class="text-3xl font-semibold">{{ item.version }}</div>
                  <a-tag v-if="id == 0" class="ml-3 h-5 mt-2" size="sm" color="blue">最新版</a-tag>
                </div>
                <div class="mt-2 text-sm text-gray-800 dark:text-gray-300">
                  >= {{ item.require }}
                </div>
              </div>

              <MdPreview
                :id="`version_${id}`"
                :modelValue="item.update_log"
                :theme="appStore.mode === 'dark' ? 'dark' : 'light'"
                previewTheme="github"
              />
              <div class="border-t pt-2 dark:border-gray-700" v-if="props.myApp.includes(data?.app?.identifier)">
                <a-button><template #icon><icon-cloud-download /></template>安装此版本</a-button>
              </div>
            </div>
          </div>
          </a-tab-pane>
        </a-tabs>
        <div class="w-3/12 ml-3">
          <div class="flex">
            <a-avatar
              class="w-12 h-12 rounded-full"
              :src="data?.created_by?.avatar"
            >{{ data?.created_by?.username?.substring(0, 1).toUpperCase() }}</a-avatar>
            <div class="ml-3 text-sm leading-6 mt-0.5">
              <div class="text-gray-800 dark:text-white">{{ data?.created_by?.username }}</div>
              <div class="text-gray-500 dark:text-gray-400 text-xs">应用开发者</div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-drawer>
</template>

<style scoped>
:deep(.arco-tabs-content) {
  padding-top: 5px;
}
</style>