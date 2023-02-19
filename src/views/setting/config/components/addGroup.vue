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
  <a-modal v-model:visible="visible" :footer="false" draggable width="600px">
    <template #title>添加配置组</template>

    <ma-form v-model="form" v-model:columns="columns" @onSubmit="submit" ref="maformRef"></ma-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import config from '@/api/setting/config'

const form = ref({})
const maformRef = ref()
const visible = ref(false)
const emit = defineEmits(['success'])

const open = () => {
  visible.value = true
}

const submit = async (data) => {
  if (data) {
    const response = await config.saveConfigGroup(data)
    if (response.success) {
      emit('success', true)
      visible.value = false
    } else {
      emit('success', false)
    }
  }
}

const columns = reactive([
  {
    title: '组名称（中文）',
    labelWidth: '145px',
    dataIndex: 'name',
    rules: [{ required: true, message: '组名称必填' }]
  },
  {
    title: '组标识（英文）',
    labelWidth: '145px',
    dataIndex: 'code',
    rules: [{ required: true, message: '组标识必填' }]
  },
  {
    title: '备注',
    labelWidth: '145px',
    dataIndex: 'remark',
    formType: 'textarea'
  }
])

defineExpose({ open })
</script>
