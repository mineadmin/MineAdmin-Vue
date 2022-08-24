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
  <component
    :is="componentName"
    v-model:visible="dataVisible"
    :on-before-ok="submit" @cancel="close"
    ok-text="保存"
    cancel-text="关闭"
    draggable
    :width="setting.width"
    :fullscreen="setting.isFull || false"
    unmount-on-close
  >
    <template #title>{{ actionTitle }}</template>
    <a-spin :loading="dataLoading" tip="加载中..." class="w-full">
      <a-form
        ref="crudForm"
        :model="form"
        :class="`grid grid-cols-1 lg:grid-cols-${ (! setting.layout || setting.layout === 'auto') ? ( setting.cols || 1 ) : 1} `"
        :label-align="setting.labelAlign || 'right'"
        @submit="submit"
      >
        <a-row>
          <template v-for="(item, index) in columns" :key="index">
            <a-col :span="parseInt(setting.layout === 'customer' ? ( item.span || 24 ) : 24)">
              <a-form-item
                v-if="
                  formItemShow(item) &&
                  ! ['__index', '__operation'].includes(item.dataIndex)
                "
                v-show="(typeof item.display == 'undefined' || item.display === true)"
                :label="item.title"
                :field="item.dataIndex"
                label-col-flex="auto"
                :label-col-style="{ width: item.labelWidth ? item.labelWidth : setting.labelWidth || '100px' }"
                :rules="getRules(item)"
                :validate-trigger="item.validateTrigger"
                :validate-status="item.validateStatus"
              >
                <template v-if="item.formType !== 'form-group'">
                  <a-select
                    v-if="item.formType === 'select'"
                    v-model="form[item.dataIndex]"
                    :virtual-list-props="item.virtualList ? { height: 200 } : undefined"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    :max-tag-count="item.maxTagCount || 1"
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    :options="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="handlerCascader($event, { form, item, currentAction, index })"
                  />

                  <a-checkbox-group
                    v-else-if="item.formType === 'checkbox'"
                    v-model="form[item.dataIndex]"
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    @change="handlerCascader($event, { form, item, currentAction, index })"
                  >
                    <a-checkbox
                      v-for="option in formDictData[item.dataIndex]"
                      :key="option" :value="Number.isInteger(form[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-checkbox>
                  </a-checkbox-group>

                  <a-radio-group
                    v-else-if="item.formType === 'radio'"
                    v-model="form[item.dataIndex]"
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    :type="item.type"
                    @change="handlerCascader($event, { form, item, currentAction, index })"
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
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { form, item, currentAction, index })"
                    @click="item.click && item.click($event, { form, item, currentAction, index })"
                    @blur="item.blur && item.blur($event, { form, item, currentAction, index })"
                  />

                  <a-cascader
                    v-else-if="item.formType === 'cascader'"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    :expand-trigger="item.trigger || 'click'"
                    :options="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="item.change && item.change($event, { form, item, currentAction, index })"
                    @click="item.click && item.click($event, { form, item, currentAction, index })"
                    @blur="item.blur && item.blur($event, { form, item, currentAction, index })"
                  />

                  <a-tree-select
                    v-else-if="item.formType === 'treeSelect' || item.formType === 'tree-select'"
                    v-model="form[item.dataIndex]"
                    :treeProps="{ virtualListProps: item.virtualList ? { height: 240 } : undefined }"
                    :placeholder="item.placeholder || `请选择${item.title}，可通过 key 搜索`"
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    allow-clear
                    allow-search
                    :field-names="(item.dict && item.dict.props) ? item.dict.props : { key: 'value', title: 'label' }"
                    :tree-checkable="item.treeCheckable"
                    :multiple="item.multiple"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { form, item, currentAction, index })"
                    @click="item.click && item.click($event, { form, item, currentAction, index })"
                    @blur="item.blur && item.blur($event, { form, item, currentAction, index })"
                  />

                  <component
                    v-else-if="['date', 'range', 'time'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.formType === 'range'
                      ? ['请选择开始时间', '请选择结束时间']
                      : item.placeholder ? item.placeholder : `请选择${item.title}`
                    "
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :show-time="item.showTime"
                    :type="item.type"
                    :mode="item.mode"
                    allow-clear
                    style="width: 100%;"
                    @change="item.change && item.change($event, { form, item, index })"
                    @click="item.click && item.click($event, { form, item, index })"
                    @blur="item.blur && item.blur($event, { form, item, index })"
                  />

                  <component
                    v-else-if="['month', 'year', 'week', 'quarter'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
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
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    :split="item.split"
                    :type="item.type"
                    allow-clear
                    :prefix="item.prefix"
                    @change="item.change && item.change($event, { form, item, currentAction, index })"
                    @click="item.click && item.click($event, { form, item, currentAction, index })"
                    @blur="item.blur && item.blur($event, { form, item, currentAction, index })"
                  />

                  <a-button
                    v-else-if="item.formType === 'button'"
                    :disabled="formItemDisabled(item) || item.disabled"
                    :type="item.type"
                    :status="item.status"
                    :style="item.style"
                    @click="item.click && item.click($event, { form, item, currentAction, index })"
                    @blur="item.blur && item.blur($event, { form, item, currentAction, index })"
                  >
                    <template #icon v-if="item.icon" >
                      <component :is="item.icon" />
                    </template>
                    {{ item.text || ''}}
                  </a-button>

                  <component
                    v-else
                    :is="getComponent(item)"
                    v-model="form[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="formItemDisabled(item) || item.disabled"
                    :readonly="formItemReadonly(item) || item.readonly"
                    :max-length="item.maxLength || 0"
                    :max="item.max"
                    :min="item.min"
                    :step="item.step"
                    :precision="item.precision"
                    :checked-value="item.checkedValue"
                    :unchecked-value="item.uncheckedValue"
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
                    :mode="item.formType === 'input-number' ? 'button' : item.mode"
                    :height="item.height || undefined"
                    :language="item.language || 'javascript'"
                    :isBind="item.language || false"
                    allow-clear
                    @change="item.change && item.change($event, { form, item, currentAction, index })"
                    @click="item.click && item.click($event, { form, item, currentAction, index })"
                    @blur="item.blur && item.blur($event, { form, item, currentAction, index })"
                    :style="item.style"
                  />
                </template>

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
      </a-form>
    </a-spin>
  </component>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'
import { handlerProps } from '../js/common'
import { isArray, isFunction } from 'lodash'
import MaFormGroup from '@/components/ma-form/formGroup.vue'

const componentName = ref('a-modal')
const columns = ref([])
const currentAction = ref('')
const dataVisible = ref(false)
const form = ref({})
const crudForm = ref(null)
const actionTitle = ref('')
const dataLoading = ref(true)
const formDictData = ref({})
const setting = ref({})
const emit = defineEmits(['success', 'error'])
const props = defineProps({
  modelValue: Array,
  crud: { type: Object }
})
setting.value = props.crud.viewLayoutSetting
watch(
  () => props.crud.viewLayoutSetting,
  vl => setting.value = vl,
  { deep: true }
)
watch(
  () => form,
  vl => {
    const tempForm = vl.value
    const obj = []
    for (let name in tempForm) {
      columns.value.map( item => {
        if (item.dataIndex === name && item.control && isFunction(item.control)) {
          obj.push(item.control(tempForm[name], tempForm))
        }
      })
    }
    obj.map(changItem => {
      columns.value.map( (item, idx) => {
        for (let name in changItem) {
          if (name == item.dataIndex) {
            columns.value[idx] = Object.assign(item, changItem[name] || {})
          }
        }
      })
    })
  },
  { deep: true }
)
const submit = (done) => {
  crudForm.value.validate()
  .then(async result => {
    if (result) {
      done(false)
      return
    }
    let response
    if (currentAction.value === 'add') {
      isFunction(props.crud.beforeAdd) && props.crud.beforeAdd(form.value)
      response = await props.crud.add.api(form.value)
      isFunction(props.crud.afterAdd) && props.crud.afterAdd(response, form.value)
    } else {
      isFunction(props.crud.beforeEdit) && props.crud.beforeEdit(form.value)
      response = await props.crud.edit.api(form.value[props.crud.pk], form.value)
      isFunction(props.crud.afterEdit) && props.crud.afterEdit(response, form.value)
    }
    if ( response.code === 200 ) {
      Message.success(response.message || `${actionTitle.value}成功！`)
      emit('success', response)
      done()
    } else {
      Message.error(response.message || `${actionTitle.value}失败！`)
      emit('error', response)
      done(false)
    }
  })
  .catch()
  //.finally( done(false) )
}
const open = () => {
  nextTick(() =>{
    componentName.value = setting.value.viewType === 'drawer' ? 'a-drawer' : 'a-modal'
    dataVisible.value = true
    columns.value = props.modelValue
    init()
  })
}
const close = () => {
  dataVisible.value = false
  columns.value = []
  form.value = {}
}
const add = () => {
  actionTitle.value = '新增'
  currentAction.value = 'add'
  open()
}
const edit = (data) => {
  actionTitle.value = '编辑'
  currentAction.value = 'edit'
  for (let i in data) form.value[i] = data[i]
  open()
}
const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })
const init = () => {
  dataLoading.value = true
  const allowRequestFormType = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'tree-select', 'cascader']
  const allowCoverFormType = ['radio', 'checkbox', 'select', 'transfer']
  const arrayDefault = ['checkbox', 'user-select', 'form-group']
  if (columns.value.length > 0) {
    columns.value.map(async item => {
      if (! formItemShow(item) || ['__index', '__operation'].includes(item.dataIndex)) return
      // add 默认值处理
      if (currentAction.value === 'add') {
        form.value[item.dataIndex] = undefined
        if (item.addDefaultValue && isFunction(item.addDefaultValue)) {
          form.value[item.dataIndex] = await item.addDefaultValue(form.value)
        } else if (item.addDefaultValue) {
          form.value[item.dataIndex] = item.addDefaultValue
        } else if (arrayDefault.includes(item.formType)) {
          form.value[item.dataIndex] = []
        }
      }
      // edit 默认值处理
      if (currentAction.value === 'edit') {
        if (item.editDefaultValue && isFunction(item.editDefaultValue)) {
          form.value[item.dataIndex] = await item.editDefaultValue(form.value)
        } else if (typeof item.editDefaultValue != 'undefined') {
          form.value[item.dataIndex] = item.editDefaultValue
        }
      }
      if (allowRequestFormType.includes(item.formType) && item.dict) {
        if (item.dict.name) {
          const response = await commonApi.getDict(item.dict.name)
          if (response.data) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response.data)
          }
        } else if (item.dict.url) {
          const response = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.body || {})
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
      columns.value.map( item => {
        if (item.dataIndex === name && item.control && isFunction(item.control)) {
          obj.push(item.control(form.value[name], form.value))
        }
      })
    }
    obj.map(changItem => {
      columns.value.map( (item, idx) => {
        for (let name in changItem) {
          if (name == item.dataIndex) {
            columns.value[idx] = Object.assign(item, changItem[name] || {})
          }
        }
      })
    })
  }
  dataLoading.value = false
}
const handlerCascader = (val, column) => {
  if (column.cascaderItem && isArray(column.cascaderItem) && column.cascaderItem.length > 0 && val) {
    dataLoading.value = true
    column.cascaderItem.map(async name => {
      const dict = columns.value.filter(col => col.dataIndex === name && col.dict )[0].dict
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
    dataLoading.value = false
  }
}
const formItemShow = (item) => {
  if (currentAction.value === 'add' && typeof item.addDisplay == 'undefined' || item.addDisplay) {
    return true
  }
  if (currentAction.value === 'edit' && typeof item.editDisplay == 'undefined' || item.editDisplay) {
    return true
  }
  return false
}
const formItemDisabled = (item) => {
  if (currentAction.value === 'add' && item.addDisabled) {
    return true
  }
  if (currentAction.value === 'edit' && item.editDisabled) {
    return true
  }
  return false
}
const formItemReadonly = (item) => {
  if (currentAction.value === 'add' && item.addReadonly) {
    return true
  }
  if (currentAction.value === 'edit' && item.editReadonly) {
    return true
  }
  return false
}
const getRules = (item) => {
  if (currentAction.value === 'add') {
    return item.addRules ? item.addRules : item.rules || []
  }
  if (currentAction.value === 'edit') {
    return item.editRules ? item.editRules : item.rules || []
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
    case 'user-info': return 'ma-user-info'
    case 'city-linkage': return 'ma-city-linkage'
    case 'select-resource': return 'ma-resource-button'
    default: return `a-${item.formType}`
  }
}
defineExpose({ add, edit })
</script>