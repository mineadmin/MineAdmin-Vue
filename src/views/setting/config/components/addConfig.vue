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
      @onSubmit="submit"
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
  { label: '文本框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉选择框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '开关', value: 'switch' },
  { label: '图片上传', value: 'upload' },
  { label: '富文本编辑器', value: 'editor' },
]

const submit = async (data) => {
  if (data) {
    if (data.config_select_data) {
      data.config_select_data = data.config_select_data.replace(/\r|\n|\s/g, '')
      data.config_select_data = data.config_select_data.replace(',]', ']')
      data.config_select_data = JSON.parse(data.config_select_data)
    }
    const response = await config.save(data)
    emit('success', response.success)
    response.success && formRef.value.resetForm()
  }
}

const columns = reactive([
  {
    title: '所属组',
    dataIndex: 'group_id',
    formType: 'select',
    labelWidth: '120px',
    dict: { url: 'setting/configGroup/index', props: { label: 'name', value: 'id' }},
    rules: [{ required: true, message: '所属组必选' }]
  },
  {
    title: '配置标题',
    dataIndex: 'name',
    labelWidth: '120px',
    rules: [{ required: true, message: '配置标题必填' }]
  },
  {
    title: '配置标识',
    dataIndex: 'key',
    labelWidth: '120px',
    rules: [{ required: true, message: '配置标识必填' }]
  },
  {
    title: '配置值',
    dataIndex: 'value',
    labelWidth: '120px',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    formType: 'input-number',
    labelWidth: '120px',
    min: 0,
    max: 999,
  },
  {
    title: '输入组件',
    dataIndex: 'input_type',
    formType: 'select',
    rules: [{ required: true, message: '输入组件必选' }],
    labelWidth: '120px',
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
    labelWidth: '120px',
    height: 200,
    formExtra: '用于配置下拉、单选、复选的数据，格式例子：[{"label":"数据一", "value":"shuju1"},...]',
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