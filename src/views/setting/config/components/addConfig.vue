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
  <div>
    <a-page-header title="添加配置项" :show-back="false"></a-page-header>
    <ma-form
      ref="formRef"
      v-model="form"
      :columns="columns"
      class="mt-7"
      @submit="submit"
    ></ma-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import config from '@/api/setting/config'

const emit = defineEmits(['success'])
const formRef = ref()
const form = ref({ input_type: 'input', sort: 0 })
const inputComponent = [
  { label: '文本框', code: 'input' },
  { label: '文本域', code: 'textarea' },
  { label: '下拉选择框', code: 'select' },
  { label: '单选框', code: 'radio' },
  { label: '复选框', code: 'checkbox' },
  { label: '开关', code: 'switch' },
  { label: '图片上传', code: 'upload' },
]

const submit = async (data, done) => {
  if (data) {
    done(true)
    const response = await config.save(data)
    emit('success', response.success)
    response.success && formRef.value.reset()
    done(false)
  }
}

const columns = reactive([
  {
    title: '所属组',
    dataIndex: 'group_id',
    formType: 'select',
    dict: { url: 'setting/configGroup/index', props: { label: 'name', value: 'id' }},
    rules: [{ required: true, message: '所属组必选' }]
  },
  {
    title: '配置标题',
    dataIndex: 'name',
    rules: [{ required: true, message: '配置标题必填' }]
  },
  {
    title: '配置标识',
    dataIndex: 'key',
    rules: [{ required: true, message: '配置标识必填' }]
  },
  {
    title: '配置值',
    dataIndex: 'value',
    rules: [{ required: true, message: '配置值必填' }]
  },
  {
    title: '排序',
    dataIndex: 'sort',
    formType: 'input-number',
    min: 0,
    max: 999,
  },
  {
    title: '输入组件',
    dataIndex: 'input_type',
    formType: 'select',
    rules: [{ required: true, message: '输入组件必选' }],
    dict: { data: inputComponent },
    control: (val) => {
      const temp = ['select', 'radio', 'checkbox']
      return { config_select_data: { display: temp.includes(val) } }
    }
  },
  {
    title: '配置选择数据',
    dataIndex: 'config_select_data',
    formType: 'code-editor',
    height: 200,
    formExtra: '用于配置下拉、单选、复选的数据，格式例子：[{"label":"数据一", "code":"shuju1"},...]',
  }
])

</script>

<style scoped>
:deep(.arco-page-header) {
  padding: 0;
}
:deep(.arco-page-header-wrapper) {
  padding-left: 0;
}
</style>