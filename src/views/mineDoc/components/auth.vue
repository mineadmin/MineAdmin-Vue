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
  <div
    class="auth-container flex justify-center items-center"
    :style="`background-color: ${appStore.mode == 'light' ? '#ebedf1' : '#242424'}`"
  >
    <div class="auth-panel">
      <div class="flex text-2xl justify-center mt-5 title">
        <img src="/logo.svg" width="56" class="mr-2" />
        <div class="mt-0.5">Api Document</div>
      </div>
      <a-form :model="form" layout="vertical" class="mt-3 p-5" @submit="submit" ref="formRef">
        <a-form-item
          label="APP ID"
          field="app_id"
          :rules="[{ required: true, message: 'APP ID必填' }]"
        >
          <a-input v-model="form.app_id" placeholder="请输入 APP ID" />
        </a-form-item>
        <a-form-item
          label="APP SECRET"
          field="app_secret"
          :rules="[{ required: true, message: 'APP SECRET必填' }]"
        >
          <a-input-password v-model="form.app_secret" placeholder="请输入 APP SECRET" />
        </a-form-item>
        <a-form-item class="mt-2">
          <a-button long type="primary" size="large" html-type="submit">登录文档</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore, useDocStore } from '@/store'
import doc from '@/api/doc'

const appStore = useAppStore()
const docStore = useDocStore()
const router = useRouter()
const route = useRoute()
const form = ref({ app_id: '', app_secret: '' })
const formRef = ref()

const submit = ({ values, errors }) => {
  if(errors) return false
  formRef.value.validate().then(() => {
    docAuth(values)
  })
}

const docAuth = (data) => {
  doc.login(data).then(res => {
    if (res.success && res.code == 200) {
      docStore.appId = data.app_id
      docStore.appSecret = data.app_secret
      docStore.auth = true
      nextTick(() => {
        router.push({ name: 'interfaceList' })
      })
    }
  })
}

if (route.query.app_id && route.query.app_secret) {
  form.value.app_id = route.query.app_id
  form.value.app_secret = route.query.app_secret
  docAuth(form.value)
}
</script>

<style scoped>
.auth-container {
  background-image: url(/auth-bg.svg);
  background-size: cover;
  height: 100%;
}
.auth-panel {
  width: 380px;
  background: var(--color-bg-2);
  backdrop-filter: blur(10px);
  height: 355px; border-radius: 6px;
  padding: 10px;
  box-shadow: 0 0 5px var(--color-fill-4);
}
.title { 
  color: var(--color-text-1);
}
</style>