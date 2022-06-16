<template>
  <component
    :is="componentName"
    v-model:visible="dataVisible"
    @ok="save" @cancel="close"
    ok-text="保存"
    cancel-text="关闭"
    draggable
    :width="props.setting.width || 600"
    :fullscreen="props.setting.isFull || false"
    unmount-on-close
  >
    <template #title>{{ actionTitle }}</template>
    <a-spin :loading="dataLoading" tip="加载数据中..." class="w-full">
      <a-form
        :model="form"
        :class="`grid grid-cols-1 lg:grid-cols-${props.setting.cols || 1}`"
        :label-align="props.setting.labelAlign || 'right'"
      >
        <template v-for="(item, index) in columns" :key="index">
          <a-form-item
            v-if="formItemShow(item) && ! ['__index', '__operation'].includes(item.dataIndex)"
            :label="item.title"
            :field="item.dataIndex"
            label-col-flex="auto"
            :label-col-style="{ width: item.labelWidth || '100px' }"
          >
            <a-select
              v-if="item.formType === 'select'"
              v-model="form[item.dataIndex]"
              :virtual-list-props="{ height:200 }"
              :placeholder="item.placeholder || `请选择${item.title}`"
              allow-clear
              allow-search
              :disabled="item.disabled"
              :readonly="item.readonly"
              :options="formDictData[item.dataIndex]"
              :multiple="item.multiple"
              @change="handlerCascader($event, item)"
            />

            <a-checkbox-group
              v-else-if="item.formType === 'checkbox'"
              v-model="form[item.dataIndex]"
              :disabled="item.disabled"
              :readonly="item.readonly"
              @change="handlerCascader($event, item)"
            >
              <a-checkbox
                v-for="option in formDictData[item.dataIndex]"
                :key="option" :value="option.value"
              >{{ option.label }}</a-checkbox>
            </a-checkbox-group>

            <a-radio-group
              v-else-if="item.formType === 'radio'"
              v-model="form[item.dataIndex]"
              :disabled="item.disabled"
              :readonly="item.readonly"
              @change="handlerCascader($event, item)"
            >
              <a-radio
                v-for="option in formDictData[item.dataIndex]"
                :key="option" :value="option.value"
              >{{ option.label }}</a-radio>
            </a-radio-group>

            <a-transfer
              v-else-if="item.formType === 'transfer'"
              :title="['源数据', '目标数据']"
              v-model="form[item.dataIndex]"
              :show-search="item.showSearch"
              :disabled="item.disabled"
              :expand-trigger="item.trigger || 'click'"
              :data="formDictData[item.dataIndex]"
              :multiple="item.multiple"
              @change="item.changeEvent"
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
              @change="item.changeEvent"
            />

            <a-tree-select
              v-else-if="item.formType === 'treeSelect'"
              v-model="form[item.dataIndex]"
              :treeProps="{ virtualListProps: { height: 240 } }"
              :placeholder="item.placeholder || `请选择${item.title}`"
              :disabled="item.disabled"
              :readonly="item.readonly"
              allow-clear
              allow-search
              label-in-value
              :tree-checkable="item.multiple"
              :multiple="item.multiple"
              :data="formDictData[item.dataIndex]"
              @change="item.changeEvent"
            />

            <component
              v-else-if="['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(item.formType)"
              :is="getComponent(item)"
              v-model="form[item.dataIndex]"
              :placeholder="item.placeholder || `请选择${item.title}`"
              :format="item.format || ''"
              :disabled="item.disabled"
              :readonly="item.readonly"
              allow-clear
              style="width: 100%;"
              @change="item.changeEvent"
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
              :prefix="item.mentionPrefix"
              :type="item.type"
              :show-word-limit="['input', 'textarea'].includes(item.formType) ? true : false"
              allow-clear
              @change="item.changeEvent"
            />
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
  </component>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { request } from '@/utils/request'
import { isArray } from '@vue/shared'
import { Message } from '@arco-design/web-vue'

const componentName = ref('a-modal')
const columns = ref([])
const currentAction = ref('')
const dataVisible = ref(false)
const form = ref({})
const actionTitle = ref('')

const dataLoading = ref(true)
const formDictData = ref({})

const props = defineProps({
  modelValue: Array,
  setting: { type: Object, default: { viewType: 'modal', width: '500' }}
})

const save = () => {}

const open = () => {
  nextTick()
  componentName.value = props.setting.viewType === 'modal' ? 'a-modal' : 'a-drawer'
  dataVisible.value = true
  columns.value = props.modelValue
  init()
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

const update = (data) => {
  actionTitle.value = '编辑'
  currentAction.value = 'edit'
  open()
}

const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })

const init = () => {
  const allowRequestFormType = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'cascader']
  const allowCoverFormType = ['radio', 'checkbox', 'select', 'transfer']
  if (columns.value.length > 0) {
    columns.value.map(async item => {
      form.value[item.dataIndex] = undefined

      if (allowRequestFormType.includes(item.formType) && item.dict) {
        if (item.dict.url) {
          let response = await requestDict(item.dict.url, item.dict.method || 'GET', item.dict.params || {}, item.dict.data || {})
          if (response.data) {
            if (allowCoverFormType.includes(item.formType)) {
              formDictData.value[item.dataIndex] = response.data.map(dicItem => {
                return {
                  'label': dicItem[ (item.dict.props && item.dict.props.label) || 'code'  ],
                  'value': dicItem[ (item.dict.props && item.dict.props.value) || 'value' ]
                } 
              })
            } else {
              formDictData.value[item.dataIndex] = response.data
            }
          }
        } else if (item.dict.data && isArray(item.dict.data) && item.dict.data.length > 0) {
          if (allowCoverFormType.includes(item.formType)) {
            formDictData.value[item.dataIndex] = item.dict.data.map(dicItem => {
              return {
                'label': dicItem[ (item.dict.props && item.dict.props.label) || 'code'  ],
                'value': dicItem[ (item.dict.props && item.dict.props.value) || 'value' ]
              } 
            })
          } else {
            formDictData.value[item.dataIndex] = item.dict.data
          }
        }
      }
    })
  }
  dataLoading.value = false
}

const handlerCascader = (val, column) => {
  if (column.cascaderItem && isArray(column.cascaderItem) && column.cascaderItem.length > 0 && val) {
    dataLoading.value = true
    column.cascaderItem.map(async name => {
      const dict = props.columns.filter(col => col.dataIndex === name)[0].dict
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
    })
    dataLoading.value = false
  }
}

const formItemShow = (item) => {
  if (currentAction.value === 'add' && typeof item.addDisplay == 'undefined' || item.addDisplay) {
    return true
  }
  if (currentAction.value === 'edit' && typeof item.editDisplay == 'undefined' || item.addeditDisplayDisplay) {
    return true
  }
  return false
}

const getComponent = (item) => {
  if (! item.formType) {
    return `a-input`
  }
  if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(item.formType)) {
    return `a-${item.formType}-picker`
  } else if (['image', 'file', 'upload'].includes(item.formType)) {
    
  } else {
    return `a-${item.formType}`
  }
}

defineExpose({ add, update })
</script>