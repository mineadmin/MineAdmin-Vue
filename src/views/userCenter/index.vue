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
  <div class="block">
    <div class="user-header rounded-sm text-center">
      <a-avatar :size="100" class="mt-7">
        <img
          :src="
          (userStore.user && userStore.user.avatar)
          ? userStore.user.avatar
          : '/avatar.jpg'"
        />
      </a-avatar>
      <div><a-tag size="large" class="mt-3 rounded-full" color="#165dff">{{ userStore.user.nickname || userStore.user.username }}</a-tag></div>
    </div>

    <a-layout-content class="block lg:flex lg:justify-between">
      <div class="ma-content-block w-full lg:w-6/12 mt-3 p-4">
        <a-tabs type="rounded">
          <a-tab-pane key="info" title="个人资料">
            <a-form class="w-full md:w-full mt-3">
              <a-form-item label="账户名" label-col-flex="80px">
                <a-input disabled :default-value="userStore.user.username" allow-clear />
              </a-form-item>
              <a-form-item label="昵称" label-col-flex="80px">
                <a-input v-model="userStore.user.nickname" allow-clear />
              </a-form-item>
              <a-form-item label="手机" label-col-flex="80px">
                <a-input v-model="userStore.user.phone" allow-clear />
              </a-form-item>
              <a-form-item label="邮箱" label-col-flex="80px">
                <a-input v-model="userStore.user.email" allow-clear />
              </a-form-item>
              <a-form-item label="个人签名" label-col-flex="80px">
                <a-textarea v-model="userStore.user.signed" :max-length="255" class="h-28" show-word-limit allow-clear />
              </a-form-item>
              <a-form-item label-col-flex="80px">
                <a-button html-type="submit" type="primary">保存</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="safe" title="安全设置">
            <a-form class="w-full md:w-full mt-3">
              <a-form-item label="旧密码" label-col-flex="80px">
                <a-input-password allow-clear />
              </a-form-item>
              <a-form-item label="新密码" label-col-flex="80px">
                <a-input-password allow-clear />
              </a-form-item>
              <a-form-item label="确认密码" label-col-flex="80px">
                <a-input-password allow-clear />
              </a-form-item>
              <a-form-item label-col-flex="80px">
                <a-button html-type="submit" type="primary">保存</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="ma-content-block w-full lg:w-6/12 mt-3 p-4 ml-0 lg:ml-3">
        <a-tabs type="rounded">
          <a-tab-pane key="login-log" title="登录日志">
            <a-timeline class="pl-5 mt-3">
              <a-timeline-item label="河南-洛阳市:电信">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-洛阳市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane key="operation-log" title="操作日志">
            <a-timeline class="pl-5 mt-3">
              <a-timeline-item label="河南-洛阳市:电信">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-洛阳市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
              <a-timeline-item label="河南-郑州市:联通">于 2022-07-13 登录了系统</a-timeline-item>
            </a-timeline>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-content>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store'
  const userStore = useUserStore()
</script>

<style scoped>
.user-header {
  width: 100%;
  height: 200px;
  background: url('@/assets/userBanner.jpg') no-repeat;
  background-size: cover;
}
</style>