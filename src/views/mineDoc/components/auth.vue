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
  <div class="auth-container flex justify-center items-center">
    <div class="auth-panel">
      <div class="flex text-2xl justify-center mt-5">
        <img src="logo.svg" width="56" class="mr-2" />
        <div class="mt-0.5">Api Document</div>
      </div>
      <a-form :model="form" layout="vertical" class="mt-3 p-5" @submit="submit">
        <a-form-item
          label="APP ID"
          :rules="[{ required: true, message: 'APP ID必填' }]"
        >
          <a-input placeholder="请输入 APP ID" />
        </a-form-item>
        <a-form-item
          label="APP SECRET"
          :rules="[{ required: true, message: 'APP SECRET必填' }]"
        >
          <a-input placeholder="请输入 APP SECRET" />
        </a-form-item>
        <a-form-item>
          <a-button long type="primary" size="large" html-type="submit">登录文档</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({})

const submit = (data) => {

}
</script>

<style scoped>
.auth-container {
  background: var(--color-fill-4);
  background-size: cover;
  height: 100%;
}
.auth-panel {
  width: 380px;
  background: #fff;
  backdrop-filter: blur(10px);
  height: 355px; border-radius: 6px;
  padding: 10px;
  box-shadow: 0 0 5px var(--color-fill-4);
}
</style>