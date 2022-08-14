<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="work-area p-5">
    <div class="ma-content-block shadow p-5">
      <div class="text-2xl">{{ appInfo.app_name }}</div>
      <div class="mt-2">
        <a-divider orientation="left">最后更新时间</a-divider>
        <p>{{ appInfo.updated_at }}</p>
        <a-divider orientation="left">应用介绍</a-divider>
        <div class="description" v-html="appInfo.description"></div>
      </div>
    </div>

    <div class="ma-content-block shadow p-5 mt-5">
      <a-space class="mb-5">
        <a-button type="primary" @click="() => globalParamsRef.open()">设置全局参数</a-button>
        <a-button type="primary" status="danger" @click="clearGlobalParams">清除全局参数</a-button>
        <a-button type="primary" status="warning" @click="getIdentity">生成简易模式 Identity</a-button>
        <a-button type="primary" status="warning" @click="getAccessToken">生成复杂模式 AccessToken</a-button>
      </a-space>

      <a-collapse :default-active-key="['1']" expand-icon-position="right">
        <a-collapse-item :header="item.name" v-for="(item, index) in appInfo.apis" :key="(index + 1).toString()">
          <a-space size="large">
            <a-tooltip content="点击复制">
              <a-tag color="arcoblue" bordered class="cursor-pointer" size="large"
                @click="$common.copy(`/api/v1/${item.access_name}`)">
                /api/v1/{{ item.access_name }}
              </a-tag>
            </a-tooltip>
            <a-tooltip content="允许请求的方式">
              <a-tag color="green" size="large" bordered v-if="item.request_mode === 'A'">ALL</a-tag>
              <a-tag color="pinkpurple" size="large" bordered v-if="item.request_mode === 'P'">POST</a-tag>
              <a-tag color="red" size="large" bordered v-if="item.request_mode === 'P'">PUT</a-tag>
              <a-tag color="orangered" size="large" bordered v-if="item.request_mode === 'D'">DELETE</a-tag>
            </a-tooltip>
            <a-button type="primary" @click="() => sliderRef.open(item)">测试接口 / 查看详情</a-button>
          </a-space>
          <div class="mt-5"></div>
          <div>
            <a-divider orientation="left">最后更新时间</a-divider>
            <p>{{ item.updated_at }}</p>
          </div>
        </a-collapse-item>
      </a-collapse>
    </div>

    <global-params ref="globalParamsRef" />

    <slider-drawer ref="sliderRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import doc from '@/api/doc'
import { useDocStore } from '@/store'
import tool from '@/utils/tool'
import { copy } from '@/utils/common'
import { request } from '@/utils/request.js'
import { Message } from '@arco-design/web-vue'
import GlobalParams from './components/globalParams.vue'
import SliderDrawer from './components/sliderDrawer.vue'

const docStore = useDocStore()
const appInfo = ref({})

const globalParamsRef = ref()
const sliderRef = ref()

const getAppInfo = async () => {
  const response = await doc.getAppAndInterfaceList(docStore.appId)
  appInfo.value = response.data
}

const getIdentity = async () => {
  const identity = tool.md5(docStore.appId + docStore.appSecret)
  await copy(identity)
}

const genSign = () => {
  let timestamp = Date.now()
  let obj = {
    app_id: docStore.appId,
    timestamp,
    app_secret: docStore.appSecret,
    sign_ver: "1.0",
  }

  let keysSorted = Object.keys(obj).sort((x, y) => {
    if (x < y) return 1
    else if (x > y) return -1
    else return 0
  })

  let newObj = {}

  for (let i = 0; i < keysSorted.length; i++) {
    newObj[keysSorted[i]] = obj[keysSorted[i]];
  }

  let signature = tool.md5(tool.httpBuild(newObj))

  return {
    app_id: docStore.appId,
    signature,
    timestamp,
  }

}

const getAccessToken = () => {
  const url = '/api/v1/getAccessToken?' + tool.httpBuild(genSign())

  request({ url, method: 'post' }).then(async res => {
    if (res.success) {
      await copy(res.data.access_token)
    } else {
      Message.error(res.message)
    }
  }).catch(e => {
    Message.error(e)
  })
}

const clearGlobalParams = () => {
  docStore.globalParams = undefined
  Message.success('清除成功')
}

getAppInfo()
</script>
