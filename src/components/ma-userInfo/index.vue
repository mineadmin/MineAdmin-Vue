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
  <a-select placeholder="请选择用户信息" v-model="val" @change="handlerChange">
    <a-option :value="user.id" label="用户ID" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户ID</span>
        <span>{{ user.id }}</span>
      </div>
    </a-option>
    <a-option :value="user.dept_id.toString()" label="用户部门ID" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户部门ID</span>
        <span>{{ user.dept_id }}</span>
      </div>
    </a-option>
    <a-option :value="user.username" label="用户账户名" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户账户名</span>
        <span>{{ user.username }}</span>
      </div>
    </a-option>
    <a-option :value="user.nickname" label="用户昵称" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户昵称</span>
        <span>{{ user.nickname }}</span>
      </div>
    </a-option>
    <a-option :value="user.email" label="用户邮箱" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户邮箱</span>
        <span>{{ user.email }}</span>
      </div>
    </a-option>
    <a-option :value="user.phone" label="用户手机" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户手机</span>
        <span>{{ user.phone }}</span>
      </div>
    </a-option>
    <a-option :value="user.created_at" label="用户创建时间" class="w-full">
      <div class="flex justify-between w-full">
        <span>用户创建时间</span>
        <span>{{ user.created_at }}</span>
      </div>
    </a-option>
  </a-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/store'

const user = useUserStore().user
const val = ref()

const emit = defineEmits(['update:modelValue'])
const props = defineProps({ modelValue: [ String, Number ] })

val.value = props.modelValue

const handlerChange = (value) => {
  val.value = value
}

watch(
  () => props.modelValue,
  vl => val.value = vl
)

watch(
  () => val.value,
  vl => emit('update:modelValue', vl)
)

</script>

<style scoped>
:deep(.arco-select-option-content) {
  width: 100%;
}
</style>
