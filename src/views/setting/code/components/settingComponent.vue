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
  <a-modal v-model:visible="visible" :on-before-ok="save" width="600px" draggable top="50px" :align-center="false">
    <template #title>设置组件 - {{ row?.column_comment }}</template>
    <a-form :model="form">
      <!-- 数字输入框 / 滑块 -->
      <div v-if="row.view_type == 'inputNumber' || row.view_type == 'slider'">
        <a-form-item
          label="最小值"
          field="min"
          label-col-flex="auto"
          :label-col-style="{ width: '80px' }"
        >
          <a-input-number v-model="form.min"/>
        </a-form-item>
        <a-form-item
          label="最大值"
          field="max"
          label-col-flex="auto"
          :label-col-style="{ width: '80px' }"
        >
          <a-input-number v-model="form.max"/>
        </a-form-item>
        <a-form-item
          label="步长"
          field="step"
          label-col-flex="auto"
          :label-col-style="{ width: '80px' }"
        >
          <a-input-number v-model="form.step" :min="0" />
        </a-form-item>
        <a-form-item
          label="精度"
          field="precision"
          label-col-flex="auto"
          :label-col-style="{ width: '80px' }"
          v-if="row.view_type != 'slider'"
        >
          <a-input-number v-model="form.precision" :min="0"  />
        </a-form-item>
        <a-form-item
          label="刻度线"
          field="showTicks"
          label-col-flex="auto"
          :label-col-style="{ width: '80px' }"
          v-if="row.view_type != 'inputNumber'"
        >
          <a-radio-group v-model="form.showTicks">
            <a-radio :value="true">显示</a-radio>
            <a-radio :value="false">不显示</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <!-- 开关 -->
      <div v-if="row.view_type == 'switch'">
        <a-form-item
          label="选中时的值"
          field="checkedValue"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
        >
          <a-input v-model="form.checkedValue"/>
        </a-form-item>
        <a-form-item
          label="未选中时的值"
          field="uncheckedValue"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
        >
          <a-input v-model="form.uncheckedValue"/>
        </a-form-item>
      </div>
      <!-- 下拉、复选、单选 -->
      <div v-if="['select', 'checkbox', 'radio'].includes(row.view_type)">
        <a-form-item
          label="是否多选"
          field="multiple"
          label-col-flex="auto"
          :label-col-style="{ width: '80px' }"
          v-if="row.view_type == 'select'"
        >
          <a-radio-group v-model="form.multiple">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-divider orientation="left">
          设置数据 <a-link class="ml-2" @click="add"><icon-plus /> 添加</a-link>
        </a-divider>
        <a-card v-for="(item, idx) in form.collection" :key="idx" class="mt-2 relative">
          <a-button type="primary" status="danger" @click="del(idx)" class="setdata-button">
            <template #icon><icon-delete /></template>
          </a-button>
          <a-form-item
            label="名称"
            field="label"
            label-col-flex="auto"
            :label-col-style="{ width: '80px' }"
          >
            <a-input v-model="item.label" />
          </a-form-item>
          <a-form-item
            label="值"
            field="code"
            label-col-flex="auto"
            :label-col-style="{ width: '80px' }"
          >
            <a-input v-model="item.code" />
          </a-form-item>
        </a-card>
      </div>
      <!-- 树形下拉框、级联选择器 -->
      <div v-if="['treeSelect', 'cascader'].includes(row.view_type)">
        该组件涉及多层数据嵌套，请看 <a-tag color="blue">Arco Design</a-tag> 官方文档
        <a-link class="mt-2">https://arco.design/vue/docs/start</a-link>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confrim'])
const visible = ref(false)
const row = ref({})
const form = ref({
  collection: []
})

const open = (record) => {
  row.value = record
  form.value = {
    collection: []
  }
  visible.value = true
}

const add = () => {
  form.value.collection.push({ label: '', code: ''})
}
const del = (idx) => {
  form.value.collection.splice(idx, 1)
}

const save = (done) => {
  emit('confrim', row.value.column_name, form.value)
  done(true)
}

defineExpose({ open })
</script>

<style scoped>
.setdata-button {
  right: 15px; position: absolute;
}
</style>