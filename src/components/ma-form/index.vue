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
  <div class="w-full">
    <a-spin :loading="formLoading" tip="加载中..." class="w-full">
      <a-form
        ref="crudForm"
        :model="form"
        :class="`grid grid-cols-1 lg:grid-cols-${ (props.options.layout ||  props.options.layout === 'auto') ? ( props.options.cols || 1 ) : 1}`"
        :label-align="props.options.labelAlign || 'right'"
        @submit="submit"
      >
        <a-row>
          <template v-for="(item, index) in props.columns" :key="index">
            <a-col :span="parseInt(props.options.layout === 'customer' ? ( item.span || 24 ) : 24)">
              <a-form-item
                v-show="(typeof item.display == 'undefined' || item.display === true)"
                :label="item.title"
                :field="item.dataIndex"
                label-col-flex="auto"
                :label-col-style="{ width: item.labelWidth ? item.labelWidth : props.options.labelWidth || '100px' }"
                :rules="item.rules || []"
                :validate-trigger="item.validateTrigger"
                :validate-status="item.validateStatus"
              >
                <slot
                  :name="`form-${item.dataIndex}`"
                  v-bind="{ form, item }"
                  v-if="item.formType !== 'form-group'"
                >
                  <a-select
                    v-if="item.formType === 'select'"
                    v-model="form[item.dataIndex]"
                    :virtual-list-props="{ height:200 }"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    :max-tag-count="item.maxTagCount || 1"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :options="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="handlerCascader($event, { form, item, index })"
                  />

                  <a-checkbox-group
                    v-else-if="item.formType === 'checkbox'"
                    v-model="form[item.dataIndex]"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    @change="handlerCascader($event, { form, item, index })"
                  >
                    <a-checkbox
                      v-for="option in formDictData[item.dataIndex]"
                      :key="option" :value="Number.isInteger(form[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-checkbox>
                  </a-checkbox-group>

                  <a-radio-group
                    v-else-if="item.formType === 'radio'"
                    v-model="form[item.dataIndex]"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :type="item.type"
                    @change="handlerCascader($event, { form, item, index })"
                  >
                    <a-radio
                      v-for="option in formDictData[item.dataIndex]"
                      :key="option" :value="Number.isInteger(form[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-radio>
                  </a-radio-group>

                  <a-transfer
                    v-else-if="item.formType === 'transfer'"
                    :title="['源数据', '目标数据']"
                    v-model="form[item.dataIndex]"
                    :show-search="item.showSearch"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :expand-trigger="item.trigger || 'click'"
                    :data="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                  />

                  <a-cascader
                    v-else-if="item.formType === 'cascader'"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :expand-trigger="item.trigger || 'click'"
                    :options="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                  />

                  <a-tree-select
                    v-else-if="item.formType === 'treeSelect' || item.formType === 'tree-select'"
                    v-model="form[item.dataIndex]"
                    :treeProps="{ virtualListProps: { height: 240 } }"
                    :placeholder="item.placeholder || `请选择${item.title}，可通过 key 搜索`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    allow-clear
                    allow-search
                    :field-names="(item.dict && item.dict.props) ? item.dict.props : { key: 'value', title: 'label' }"
                    :tree-checkable="item.multiple"
                    :multiple="item.multiple"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                  />

                  <component
                    v-else-if="['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :show-time="item.showTime"
                    :mode="item.mode"
                    allow-clear
                    style="width: 100%;"
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                  />

                  <component
                    v-else-if="item.formType === 'mention'"
                    :is="getComponent(item)"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :split="item.split"
                    :type="item.type"
                    allow-clear
                    :prefix="item.prefix"
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                  />

                  <component
                    v-else
                    :is="getComponent(item)"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :max-length="item.maxLength || 0"
                    :max="item.max"
                    :min="item.min"
                    :step="item.step"
                    :show-ticks="item.showTicks"
                    :allow-half="item.half"
                    :type="item.type"
                    :autocomplete="
                      (item.formType === 'input-password' || item.type == 'password') ? 'off' : item.autocomplete
                    "
                    :limit="item.limit || 0"
                    :accept="item.accept || '*'"
                    :tip="item.tip"
                    :multiple="item.multiple || false"
                    :rounded="item.rounded || false"
                    :title="item.title || '点击上传'"
                    :icon="item.icon || 'icon-plus'"
                    :chunk="item.chunk || false"
                    :only-url="item.onlyUrl || true"
                    :only-id="item.onlyId || true"
                    :file-type="item.fileType || 'button'"
                    :show-word-limit="['input', 'textarea'].includes(item.formType) ? true : false"
                    :is-echo="item.isEcho"
                    :mode="item.formType === 'input-number' ? 'button' : undefined"
                    :height="item.height || undefined"
                    :language="item.language || 'javascript'"
                    allow-clear
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                    :style="item.style"
                  />
                </slot>

                <ma-form-group
                  v-else
                  v-model="form[item.dataIndex]"
                  :options="item.childrenOptions"
                  :columns="item.children"
                >
                  <template
                    v-for="(groupItem, groupIndex) in item.children"
                    :key="groupIndex"
                    #[groupItem.dataIndex]="{ data }"
                  >
                    <slot
                      :name="`${item.dataIndex}-${groupItem.dataIndex}`"
                      v-bind="{ data, groupItem, groupIndex }"
                    />
                  </template>
                </ma-form-group>
                <template #extra v-if="item.formExtra">{{ item.formExtra }}</template>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <div class="text-center mt-5">
          <a-space size="large">
            <a-button html-type="submit" type="primary">
              <icon-check /> {{ props.options.submitText || '提交' }}
            </a-button>
            <a-button @click="crudForm.resetFields()">
              <icon-refresh /> 重置
            </a-button>
            <slot name="buttons"></slot>
          </a-space>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'
import { isArray, isFunction } from 'lodash'

import MaFormGroup from './formGroup.vue'

const columns = ref([])
const form = ref({})
const crudForm = ref(null)
const formLoading = ref(true)
const formDictData = ref({})
const emit = defineEmits(['submit', 'update:modelValue'])
const props = defineProps({
  modelValue: Object,
  columns: { type: Array },
  options: { type: Object, default: () =>
    {
      return {
        layout: 'auto',
        labelAlign: 'right',
      }
    } 
  },
})

watch(
  () => props.modelValue,
  vl => form.value = vl,
  { deep: true }
)

watch(
  () => form.value,
  vl => emit('update:modelValue', vl),
  { deep: true }
)

watch(
  () => form,
  vl => {
    const tempForm = vl.value
    const obj = []
    for (let name in tempForm) {
      props.columns.map( item => {
        if (item.dataIndex === name && item.control && isFunction(item.control)) {
          obj.push(item.control(tempForm[name], tempForm))
        }
      })
    }
    obj.map(changItem => {
      props.columns.map( (item, idx) => {
        for (let name in changItem) {
          if (name == item.dataIndex) {
            props.columns[idx] = Object.assign(item, changItem[name] || {})
          }
        }
      })
    })
    emit('update:modelValue', vl)
  },
  { deep: true }
)

const submit = (data) => {
  emit('submit', data.values, done)
}

const done = (status) => formLoading.value = status

const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })

const init = () => {
  formLoading.value = true
  const allowRequestFormType = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'tree-select', 'cascader']
  const allowCoverFormType = ['radio', 'checkbox', 'select', 'transfer']
  const arrayDefault = ['checkbox', 'user-select', 'form-group']
  if (props.columns.length > 0) {
    props.columns.map(async item => {

      form.value[item.dataIndex] = undefined
      if (arrayDefault.includes(item.formType)) {
        form.value[item.dataIndex] = []
      }
      
      if (allowRequestFormType.includes(item.formType) && item.dict) {
        if (item.dict.name) {
          const response = await commonApi.getDict(item.dict.name)
          if (response.data) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response.data)
          }
        } else if (item.dict.url) {
          const response = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.data || {})
          if (response.data) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response.data)
          }
        } else if (item.dict.data) {
          if (isArray(item.dict.data)) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, item.dict.data)
          } else if (isFunction(item.dict.data)) {
            const response = await item.dict.data()
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response)
          }
        }
      }
    })
    const obj = []
    for (let name in form.value) {
      props.columns.map( item => {
        if (item.dataIndex === name && item.control && isFunction(item.control)) {
          obj.push(item.control(form.value[name], form.value))
        }
      })
    }
    obj.map(changItem => {
      props.columns.map( (item, idx) => {
        for (let name in changItem) {
          if (name == item.dataIndex) {
            columns.value[idx] = Object.assign(item, changItem[name] || {})
          }
        }
      })
    })
  }
  formLoading.value = false
}

const handlerProps = (allowType, item, tmpArr) => {
  let data = []
  let tran = {}
  if (allowType.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = dicItem[ (item.dict.props && item.dict.props.label) || 'label'  ]
      const value = dicItem[ (item.dict.props && item.dict.props.value) || 'code' ]
      tran[value] = label
      return { label, value } 
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  return data
}

const handlerCascader = (val, column) => {
  if (column.cascaderItem && isArray(column.cascaderItem) && column.cascaderItem.length > 0 && val) {
    formLoading.value = true
    column.cascaderItem.map(async name => {
      const dict = props.columns.filter(col => col.dataIndex === name && col.dict )[0].dict
      if (dict && dict.url && dict.props) {
        let response
        if (dict && dict.url.indexOf('{{key}}') > 0) {
          response = await requestDict(dict.url.replace('{{key}}', val), dict.method || 'GET', dict.params || {}, dict.data || {})
        } else {
          let temp = { key: val }
          const params = Object.assign(dict.params || {}, temp)
          const data   = Object.assign(dict.data || {}, temp)
          response = await requestDict(dict.url, dict.method || 'GET', params || {}, data || {})
        }
        // 原始数据格式的
        if (response.data && response.data.data && response.status === 200) {
          formDictData.value[name] = response.data.data
        } else {
          Message.error('字典联动请求失败：' + name)
          console.error(response)
        }
        if (response.data && response.code === 200) {
          formDictData.value[name] = response.data.map(dicItem => {
            return {
              'label': dicItem[ (dict.props && dict.props.label) || 'code'  ],
              'value': dicItem[ (dict.props && dict.props.value) || 'value' ]
            } 
          })
        }
      }
    })
    formLoading.value = false
  }
}

const getComponent = (item) => {
  if (! item.formType) {
    return `a-input`
  }
  if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(item.formType)) {
    return `a-${item.formType}-picker`
  }
  
  switch (item.formType) {
    case 'upload': return 'ma-upload'
    case 'select-user': return 'ma-user'
    case 'editor': return 'ma-editor'
    case 'code-editor': return 'ma-code-editor'
    case 'icon': return 'ma-icon'
    default: return `a-${item.formType}`
  }
}

init()
</script>