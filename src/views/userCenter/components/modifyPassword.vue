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
  <a-form class="w-full md:w-full mt-3" :model="password" @submit="modifyPassword">
    <a-form-item
      label="旧密码"
      field="oldPassword"
      label-col-flex="80px"
      :rules="[{ required: true, message: '旧密码必填'}]"
    >
      <a-input-password
        v-model="password.oldPassword"
        allow-clear
        autocomplete="off"
      />
    </a-form-item>
    <a-form-item
      label="新密码"
      field="newPassword"
      label-col-flex="80px"
      :rules="[{ required: true, message: '新密码必填'}]"
    >
      <a-input-password
        v-model="password.newPassword"
        @input="checkSafe"
        @clear="() => passwordSafePercent = 0"
        autocomplete="off"
        allow-clear
      />
    </a-form-item>
    <a-form-item label="密码安全" label-col-flex="80px">
      <a-progress
        :steps="3"
        status="success"
        :percent="passwordSafePercent"
        animation
        :show-text="false"
      />
    </a-form-item>
    <a-form-item
      label="确认密码"
      field="newPassword_confirmation"
      label-col-flex="80px"
      :rules="[{ required: true, message: '确认密码必填' }]"
    >
      <a-input-password
        allow-clear
        v-model="password.newPassword_confirmation"
        autocomplete="off"
      />
    </a-form-item>
    <a-form-item label-col-flex="80px">
      <a-button html-type="submit" type="primary">保存</a-button>
    </a-form-item>
  </a-form>

  <a-modal v-model:visible="visible" @ok="resetLogin">
    <template #title>提示</template>
    密码已经修改成功，需要重新登录系统，点击确定跳转登录页面。
  </a-modal>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import user from '@/api/system/user'
  import tool from '@/utils/tool'

  const password = reactive({
    oldPassword: '',
    newPassword: '',
    newPassword_confirmation: ''
  })

  const visible = ref(false)
  const passwordSafePercent = ref(0)

  const resetLogin = () => {
    window.location.href = '/'
  }

  const modifyPassword = async (data) => {
    if (! data.errors) {
      if (data.values.newPassword !== data.values.newPassword_confirmation) {
        Message.error('确认密码与新密码不一致')
        return
      }
      const response = await user.modifyPassword(data.values)
      if (response.success) {
        tool.local.clear()
        visible.value = true
      } else {
        Message.error(response.message)
      }
    }
  }

  const checkSafe = (password) => {
    if (password.length < 1) {
      passwordSafePercent.value = 0
      return
    }

    if (! (password.length >= 6) ) {
      passwordSafePercent.value = 0
      return 
    }

    passwordSafePercent.value = 0.1

    if (/\d/.test(password)) {
      passwordSafePercent.value += 0.1
    }

    if (/[a-z]/.test(password)) {
      passwordSafePercent.value += 0.1
    }

    if (/[A-Z]/.test(password)) {
      passwordSafePercent.value += 0.3
    }

    if (/[`~!@#$%^&*()_+<>?:"{},./;'[\]]/.test(password)) {
      passwordSafePercent.value += 0.4
    }
  }
</script>