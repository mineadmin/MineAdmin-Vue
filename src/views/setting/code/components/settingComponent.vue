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
      <div v-if="['select', 'checkbox', 'radio', 'transfer'].includes(row.view_type)">
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
            field="value"
            label-col-flex="auto"
            :label-col-style="{ width: '80px' }"
          >
            <a-input v-model="item.value" />
          </a-form-item>
        </a-card>
      </div>
      <!-- 树形下拉框、级联选择器 -->
      <div v-if="['treeSelect', 'cascader'].includes(row.view_type)">
        该组件涉及多层数据嵌套，请看 <a-tag color="blue">Arco Design</a-tag> 官方文档
        <a-link class="mt-2">https://arco.design/vue/docs/start</a-link>
      </div>
      <!-- 编辑器相关 -->
      <div v-if="['codeEditor', 'editor'].includes(row.view_type)">
        <a-form-item
          label="编辑器高度"
          field="height"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
        >
          <a-input-number v-model="form.height" :max="1000" :min="100"/>
        </a-form-item>
        <a-form-item
          label="双向绑定数据"
          field="isBind"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          v-if="row.view_type == 'codeEditor'"
        >
          <a-radio-group v-model="form.isBind">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <!-- 上传、资源选择器相关 -->
      <div v-if="['upload', 'selectResource'].includes(row.view_type)">
        <a-form-item
          label="返回数据"
          field="onlyData"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
        >
          <a-radio-group v-model="form.onlyData">
            <a-radio :value="true">单个字段数据</a-radio>
            <a-radio :value="false">全量数据</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="返回数据"
          field="returnType"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          v-if="form.onlyData"
          :extra="`支持 uploadfile 数据表所有字段，这里仅列常用部分`"
        >
          <a-select v-model="form.returnType" placeholder="请选择上传返回数据类型">
            <a-option value="url">附件URL</a-option>
            <a-option value="id">附件ID</a-option>
            <a-option value="hash">附件HASH</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="是否可多选"
          field="multiple"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
        >
          <a-radio-group v-model="form.multiple">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="是否分片上传"
          field="chunk"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          extra="分片上传不限制文件类型，选择分片上传后，上传文件类型则失效"
          v-if="row.view_type == 'upload'"
        >
          <a-radio-group v-model="form.chunk">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="上传类型"
          field="type"
          label-col-flex="auto"
          :label-col-style="{ width: '100px' }"
          v-if="row.view_type == 'upload' && !form.chunk"
          :extra="`可在 系统配置 -> 上传配置 里修改允许格式`"
        >
          <a-select v-model="form.type" placeholder="默认为图片类型">
            <a-option value="image">图片格式类型</a-option>
            <a-option value="file">非图片格式类型</a-option>
          </a-select>
        </a-form-item>
      </div>
      <!-- 用户选择器 -->
      <div v-if="row.view_type == 'selectUser'">
        <a-form-item
          label="返回数据"
          field="onlyId"
          label-col-flex="auto"
          :label-col-style="{ width: '100px' }"
        >
          <a-radio-group v-model="form.onlyId">
            <a-radio :value="true">仅用户ID</a-radio>
            <a-radio :value="false">全量数据</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <!-- 省市区联动 -->
      <div v-if="row.view_type == 'cityLinkage'">
        <a-alert title="提示">
          <p>级联选择器返回的数据类型为 String</p>
          <p>下拉框联动返回的数据类型为 Array</p>
        </a-alert>
        <a-form-item
          class="mt-3"
          label="组件类型"
          field="type"
          label-col-flex="auto"
          :label-col-style="{ width: '100px' }"
        >
          <a-select v-model="form.type" placeholder="默认为下拉框联动" allow-clear>
            <a-option value="select">下拉框联动</a-option>
            <a-option value="cascader">级联选择器</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          class="mt-3"
          label="返回数据"
          field="mode"
          label-col-flex="auto"
          :label-col-style="{ width: '100px' }"
        >
          <a-select v-model="form.mode" placeholder="默认为省市名称" allow-clear>
            <a-option value="name">省市名称</a-option>
            <a-option value="code">省市编码</a-option>
          </a-select>
        </a-form-item>
      </div>
      <!-- 日期、时间选择器 -->
      <div v-if="['time', 'date'].includes(row.view_type)">
        <a-form-item
          class="mt-3"
          label="选择器类型"
          field="formType"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          v-if="row.view_type == 'date'"
        >
          <a-select v-model="form.mode" allow-clear>
            <a-option value="date">日期选择器</a-option>
            <a-option value="week">周选择器</a-option>
            <a-option value="month">月选择器</a-option>
            <a-option value="quarter">季度选择器</a-option>
            <a-option value="year">年选择器</a-option>
          </a-select>
        </a-form-item>

        <a-form-item
          class="mt-3"
          label="是否显示时间"
          field="showTime"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
          v-if="form.mode == 'date'"
        >
          <a-radio-group v-model="form.showTime">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          class="mt-3"
          label="是否范围选择"
          field="range"
          label-col-flex="auto"
          :label-col-style="{ width: '120px' }"
        >
          <a-radio-group v-model="form.range">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        
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
  form.value = record.options ? record.options : { collection: [] }
  visible.value = true
}

const add = () => {
  form.value.collection.push({ label: '', value: ''})
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