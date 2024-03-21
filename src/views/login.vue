<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<script setup>
import { reactive, ref } from 'vue'
import verifyCode from '@cps/ma-verifyCode/index.vue'
import { useUserStore } from '@/store'
import { useTagStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { request } from '@/utils/request'

request({
  url: 'system/getBingBackgroundImage', timeout: 10000, method: 'get'
}).then( res => {
  document.getElementById('background').style.backgroundImage = `url(${res.data.url})`
})

const router = useRouter()
const route  = useRoute()
const Verify = ref(null)

const loading = ref(false)

let isDevelop =  import.meta.env.VITE_APP_ENV === 'development'

var odata = isDevelop ?
    { username: 'superAdmin', password: 'admin123', code: '' }
    : { username: '', password: '', code: '' }


const form = reactive(odata)

const userStore = useUserStore()

const redirect = route.query.redirect ? route.query.redirect : '/'

const handleSubmit = async ({ values, errors }) => {
  if (loading.value) {
    return
  }
  loading.value = true
  if ((isDevelop || Verify.value.checkResult(form.code)) && (! errors)) {
    const result = await userStore.login(form)
    if (! result) {
      loading.value = false
      return
    }
    useTagStore().clearTags()
    router.push(redirect)
  }
  loading.value = false
}
</script>
<template>
  <div id="background" class="fixed"></div>
  <div class="bg-backdrop-layout"></div>
  <div class="login-container">
    <div class="login-width md:w-10/12 w-11/12 mx-auto flex justify-between h-full items-center">
      <div class="w-6/12 mx-auto left-panel rounded-l pl-5 pr-5 hidden md:block">
        <div class="logo"><img :src="`${$url}logo.svg`" width="45"><span>{{ $title }}</span></div>
        <div class="slogan flex justify-end"><span>---- {{ $t('sys.login.slogan') }}</span></div>
      </div>

      <div class="md:w-6/12 w-11/12 md:rounded-r mx-auto pl-5 pr-5 pb-10">
        <h2 class="mt-10 text-3xl pb-0 mb-10">{{ $t('sys.login.title') }}</h2>
        <a-form :model="form" @submit="handleSubmit">
          <a-form-item
              field="username"
              :hide-label="true"
              :rules="[{ required: true, message: $t('sys.login.usernameNotice') }]"
          >
            <a-input
                v-model="form.username"
                class="w-full"
                size="large"
                :placeholder="$t('sys.login.username')"
                allow-clear
            >
              <template #prefix><icon-user /></template>
            </a-input>
          </a-form-item>

          <a-form-item
              field="password"
              :hide-label="true"
              :rules="[{ required: true, message: $t('sys.login.passwordNotice') }]"
          >
            <a-input-password
                v-model="form.password"
                :placeholder="$t('sys.login.password')"
                size="large"
                allow-clear
            >
              <template #prefix><icon-lock /></template>
            </a-input-password>
          </a-form-item>

          <a-form-item
              v-if="!isDevelop"
              field="code"
              :hide-label="true"
              :rules="[{
              required: true,
              match: /^[a-zA-Z0-9]{4}$/,
              message: $t('sys.login.verifyCodeNotice')
            }]"
          >
            <a-input
                v-model="form.code"
                :placeholder="$t('sys.login.verifyCode')"
                size="large"
                allow-clear
            >
              <template #prefix><icon-safe /></template>
              <template #append>
                <verify-code ref="Verify" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item :hide-label="true" class="mt-5">
            <a-button html-type="submit" type="primary" long size="large" :loading="loading">
              {{ $t('sys.login.loginBtn') }}
            </a-button>
          </a-form-item>

          <a-divider orientation="center">{{ $t('sys.login.otherLoginType') }}</a-divider>
          <div class="flex w-3/4 pt-2 mx-auto items-stretch justify-around">
            <a-avatar class="other-login wechat"><icon-wechat /></a-avatar>
            <a-avatar class="other-login alipay"><icon-alipay-circle /></a-avatar>
            <a-avatar class="other-login qq"><icon-qq /></a-avatar>
            <a-avatar class="other-login weibo"><icon-weibo /></a-avatar>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
#background {
  top: 0; left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.bg-backdrop-layout {
  top: 0; left: 0;
  position: fixed;
  width: 100%; height: 100%;
  z-index: 2;
  backdrop-filter: blur(25px);
}
.login-container {
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  z-index: 3;
  .login-width {
    max-width: 950px;
    background: #fff;
    padding: 10px;
    height: 500px;
    position: relative;
    top: 50%;
    margin-top: -255px;
    border-radius: 10px;
  }

  .left-panel {
    height: 491px;
    background-image: url(@/assets/login_picture.svg);
    background-repeat: no-repeat;
    background-position: center 60px;
    background-size:contain;
  }

  .logo {
    display: flex; margin-top: 20px; color: #333;
    span {
      font-size: 28px; margin-left: 15px;
      color: rgb(var(--primary-6));
    }
  }
  .slogan {
    font-size: 16px; line-height: 50px;
  }

  :deep(.arco-input-append) {
    padding: 0 !important;
  }

  .other-login{
    cursor: pointer;
  }

  .qq:hover, .alipay:hover {
    background: #165DFF;
  }
  .wechat:hover {
    background: #0f9c02;
  }

  .weibo:hover {
    background: #f3ce2b;
  }
}
</style>
