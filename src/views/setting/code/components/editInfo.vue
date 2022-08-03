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
  <a-modal v-model:visible="visible" :on-before-ok="save" fullscreen>
    <template #title>编辑生成信息 - {{ record?.table_comment }}</template>

    <a-form :model="form">
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane title="配置信息" key="base_config">
            <a-divider orientation="left">基础信息</a-divider>
            <a-row :gutter="24">
              <a-col :xs="24" :md="12" :xl="12">
                <a-form-item label="表名称" field="table_name" label-col-flex="auto" :label-col-style="{ width: '100px' }">
                  <a-input v-model="form.table_name" disabled />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12" :xl="12">
                <a-form-item
                  label="表描述"
                  field="table_comment"
                  label-col-flex="auto"
                  :label-col-style="{ width: '100px' }"
                  :rules="[{ required: true, message: '表描述必填'}]"
                >
                  <a-input v-model="form.table_comment" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="24" :xl="24">
                <a-form-item label="备注信息" field="remark" label-col-flex="auto" :label-col-style="{ width: '94px' }">
                  <a-textarea v-model="form.remark" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider orientation="left">生成信息</a-divider>
            <a-divider orientation="left">其他信息</a-divider>

        </a-tab-pane>
        <a-tab-pane title="字段配置" key="field_config"></a-tab-pane>
        <a-tab-pane title="菜单配置" key="menu_config"></a-tab-pane>
        <a-tab-pane title="关联配置" key="relation_config"></a-tab-pane>
      </a-tabs>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import generate from '@/api/setting/generate'

const record = ref({})
const visible = ref(false)
const activeTab = ref('base_config')

const form = ref({})

const open = async (id) => {
  const response = await generate.readTable({ id })
  record.value = response.data
  visible.value = true

  init()
}

const save = (done) => { done(false) }

const init = () => {
  // 设置form数据
  for (let name in record.value) form.value[name] = record.value[name]

}

defineExpose({ open })
</script>

<script>
export default { name: 'setting:code:update' }
</script>