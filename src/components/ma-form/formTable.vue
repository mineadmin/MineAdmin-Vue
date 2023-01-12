<template>
  <div class="w-full">
    <div class="mb-2"><slot name="formTableButton"></slot></div>
    <a-table class="w-full" :data="form[props.dataIndex]" :pagination="false" :loading="loading" bordered stripe>
      <template #columns>
        <!-- 新增、删除栏 -->
        <a-table-column :width="50" fixed="left">
          <template #title>
            <a-button type="primary" @click="addRow">
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
          </template>
          <template #cell="{ rowIndex }">
            <a-button type="primary" status="danger" @click="minuRow(rowIndex)">
              <template #icon><icon-minus /></template>
            </a-button>
          </template>
        </a-table-column>

        <template v-for="item in props.columns" :key="item">
          <a-table-column
            :width="item.width ?? 100"
            :title="item.title ?? ''"
            :align="item.align || 'left'"
            :fixed="item.fixed"
          >
            <template #cell="{ record, rowIndex }">
              <div
                @mouseover.stop="item.mouseover && item.mouseover($event, { record, item, rowIndex })"
                @mouseout.stop="item.mouseout && item.mouseout($event, { record, item, rowIndex })"
                @mousemove.stop="item.mousemove && item.mousemove($event, { record, item, rowIndex })"
                @click.stop="item.click && item.click($event, { record, item, rowIndex })"
              >
                <slot :name="`${item.dataIndex}`" v-bind="{ record, rowIndex, item }">
                  <a-form-item
                    v-show="formItemShow"
                    :hide-asterisk="false"
                    :hide-label="true"
                    :field="`${props.dataIndex}.${index}.${item.dataIndex}`"
                    :rules="item.rules || []"
                    :validate-trigger="item.validateTrigger"
                    :validate-status="item.validateStatus"
                  >
                    <a-select
                      v-if="item.formType === 'select'"
                      v-model="record[item.dataIndex]"
                      :virtual-list-props="item.virtualList ? { height: 200 } : undefined"
                      :placeholder="item.placeholder || `请选择${item.title}`"
                      allow-clear
                      allow-search
                      allow-create
                      :max-tag-count="item.maxTagCount || 1"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      :options="getDictData(item.dataIndex, rowIndex)"
                      :multiple="item.multiple"
                      @change="handlerCascader($event, item, rowIndex)"
                    />

                    <a-checkbox-group
                      v-else-if="item.formType === 'checkbox'"
                      v-model="record[item.dataIndex]"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      @change="handlerCascader($event, item, rowIndex)"
                    >
                      <a-checkbox
                        v-for="option in getDictData(item.dataIndex, rowIndex)"
                        :key="option" :value="Number.isInteger(record[item.dataIndex]) ? parseInt(option.value) : option.value"
                      >{{ option.label }}</a-checkbox>
                    </a-checkbox-group>

                    <a-radio-group
                      v-else-if="item.formType === 'radio'"
                      v-model="record[item.dataIndex]"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      :type="item.type"
                      @change="handlerCascader($event, item, rowIndex)"
                    >
                      <a-radio
                        v-for="option in getDictData(item.dataIndex, rowIndex)"
                        :key="option" :value="Number.isInteger(record[item.dataIndex]) ? parseInt(option.value) : option.value"
                      >{{ option.label }}</a-radio>
                    </a-radio-group>

                    <a-transfer
                      v-else-if="item.formType === 'transfer'"
                      :title="['源数据', '目标数据']"
                      v-model="record[item.dataIndex]"
                      :show-search="item.showSearch"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      :data="formDictrecord[item.dataIndex]"
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                    />

                    <a-cascader
                      v-else-if="item.formType === 'cascader'"
                      v-model="record[item.dataIndex]"
                      :placeholder="item.placeholder || `请选择${item.title}`"
                      allow-clear
                      allow-search
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      :expand-trigger="item.trigger || 'click'"
                      :options="formDictrecord[item.dataIndex]"
                      :multiple="item.multiple"
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                    />

                    <a-tree-select
                      v-else-if="item.formType === 'treeSelect' || item.formType === 'tree-select'"
                      v-model="record[item.dataIndex]"
                      :treeProps="{ virtualListProps: item.virtualList ? { height: 240 } : undefined }"
                      :placeholder="item.placeholder || `请选择${item.title}，可通过 key 搜索`"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      allow-clear
                      allow-search
                      :field-names="(item.dict && item.dict.props) ? item.dict.props : { key: 'value', title: 'label' }"
                      :tree-checkable="item.treeCheckable"
                      :tree-check-strictly="item.treeCheckStrictly"
                      :max-tag-count="item.maxTagCount ?? 2"
                      :multiple="item.multiple"
                      :data="formDictrecord[item.dataIndex]"
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                    />

                    <component
                      v-else-if="['date', 'range', 'time'].includes(item.formType)"
                      :is="getComponent(item)"
                      v-model="record[item.dataIndex]"
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
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                    />

                    <component
                      v-else-if="['month', 'year', 'week', 'quarter'].includes(item.formType)"
                      :is="getComponent(item)"
                      v-model="record[item.dataIndex]"
                      :placeholder="item.placeholder || `请选择${item.title}`"
                      :format="item.format || ''"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      allow-clear
                      style="width: 100%;"
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                    />

                    <component
                      v-else-if="item.formType === 'mention'"
                      :is="getComponent(item)"
                      v-model="record[item.dataIndex]"
                      :placeholder="item.placeholder || `请输入${item.title}`"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
                      :split="item.split"
                      :type="item.type"
                      allow-clear
                      :prefix="item.prefix"
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                    />

                    <component
                      v-else
                      :is="getComponent(item)"
                      v-model="record[item.dataIndex]"
                      :placeholder="item.placeholder || `请输入${item.title}`"
                      :disabled="item.disabled"
                      :readonly="item.readonly"
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
                      :only-data="item?.onlyData ?? true"
                      :return-type="item?.returnType ?? 'url'"
                      :only-id="item?.onlyId ?? true"
                      :file-type="item.fileType || 'button'"
                      :show-word-limit="['input', 'textarea'].includes(item.formType) ? true : false"
                      :is-echo="item.isEcho"
                      :mode="item.mode"
                      :height="item.height || undefined"
                      :language="item.language || 'javascript'"
                      :isBind="item.language || false"
                      allow-clear
                      @change="item.change && item.change($event, { record, item, rowIndex })"
                      @click="item.click && item.click($event, { record, item, rowIndex })"
                      @blur="item.blur && item.blur($event, { record, item, rowIndex })"
                      :style="item.style"
                    />
                  </a-form-item>
                </slot>
              </div>
            </template>
          </a-table-column>
        </template>

      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { request } from '@/utils/request'
import { isFunction, isArray } from 'lodash'
import commonApi from '@/api/common'
import dayjs from 'dayjs'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Object },
  parentColumns: { type: Array },
  columns: { type: Array },
  config: { type: Object },
  dataIndex: { type: String },
  emptyRow: { type: Number, default: 0 },
  cascaderKeys: { type: [ Object, String, Number, Boolean ], default: {} },
  dataIndex: { type: String, default: 'datas' },
})

const form = reactive({})
const formDictData = ref({})
const cascaderItems = ref([])
const loading = ref(false)

let cascaderKeys = {}

form[props.dataIndex] = props.modelValue ?? []

watch(
  () => props.modelValue,
  vl => form[props.dataIndex] = vl
)

watch(
  () => form[props.dataIndex],
  vl => emit('update:modelValue', vl),
  { deep: true }
)

watch(
  () => props.cascaderKeys,
  vl => {
    if (JSON.stringify(vl) != JSON.stringify(cascaderKeys)) {
      form[props.dataIndex] = []
      cascaderKeys = JSON.parse(JSON.stringify(vl))
      init()
    }
  }, { deep: true }
)

const init = async () => {
  loading.value = true
  const allowRequestFormType = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'tree-select', 'cascader']
  const allowCoverFormType = ['radio', 'checkbox', 'select', 'transfer']

  if (props.config && props.config.url && JSON.stringify( props.cascaderKeys) != '{}') {
    let tmp = {}
    tmp[props.config.cascaderKeyName] = props.cascaderKeys
    const response = await request({
      url: props.config.url,
      method: props.config.method ?? 'get',
      params: Object.assign(props.config.defaultParams, tmp),
      data: Object.assign(props.config.defaultParams, tmp),
      timeout: 10 * 1000
    })

    form[props.dataIndex] = response.data ?? []
  }

  if (props.columns.length > 0) {
    props.columns.map(item => {
      if (item.cascaderItem && item.cascaderItem.length > 0) {
        item.cascaderItem.map(name => cascaderItems.value.push(name))
        form[props.dataIndex].map(async (data, index) => {
          await handlerCascader(data[item.dataIndex], item, index, false)
        })
      }
    })

    props.columns.map(async item => {
      if (! formItemShow(item)) return
      
      if (allowRequestFormType.includes(item.formType) && item.dict && ! cascaderItems.value.includes(item.dataIndex)) {
        if (item.dict.name) {
          const response = await commonApi.getDict(item.dict.name)
          if (response.data) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response.data)
          }
        } else if (item.dict.url) {
          const key = props.cascaderKeys[item.dataIndex]
          const url = item.dict.url
          const tmp = {}
          if (key && !props.config && !props.config.url) {
            if (item.dict.url.indexOf('{{key}}') > 0) {
              url.replace('{{key}}', key)
            } else {
              tmp['key'] = key
            }
          }
          const params = Object.assign(item.dict.params || {}, tmp)
          const data   = Object.assign(item.dict.data || {}, tmp)
          const response = await requestDict(url, item.dict.method || 'GET', params, data)
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
      } else if (allowRequestFormType.includes(item.formType) && item.dict) {
        formDictData.value[item.dataIndex] = []
      }
    })
  }
  if (props.emptyRow > 0 && form[props.dataIndex].length == 0) {
    for (let i = 0; i < props.emptyRow; i++) {
      addRow()
    }
  }
  loading.value = false
}

const addRow = () => {
  form[props.dataIndex].push({})
}

const minuRow = (index) => {
  form[props.dataIndex].splice(index, 1)
}

const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })

const handlerProps = (allowType, item, tmpArr) => {
  let data = []
  let tran = {}
  if (allowType.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = dicItem[ (item.dict.props && item.dict.props.label) || 'label'  ]
      let tmp = dicItem[ (item.dict.props && item.dict.props.value) || 'value' ]
      const value = typeof tmp == 'boolean' ? tmp + '' : tmp
      tran[value] = label
      return { label, value } 
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  return data
}

const getDictData = (name, index) => {
  if (cascaderItems.value.includes(name)) {
    return formDictData.value[name] ? formDictData.value[name][index] ?? undefined : undefined
  } else {
    return formDictData.value[name]
  }
}

const handlerCascader = async (val, column, index, clearData = true) => {
  if (column.cascaderItem && isArray(column.cascaderItem) && column.cascaderItem.length > 0 && val) {
    loading.value = true
    column.cascaderItem.map(async name => {
      form[props.dataIndex][index][name] = clearData === true ? undefined : form[props.dataIndex][index][name] ?? undefined
      const dict = props.columns.filter(col => col.dataIndex === name && col.dict )[0].dict
      if (dict && dict.url) {
        let response
        if (dict && dict.url.indexOf('{{key}}') > 0) {
          response = await requestDict(dict.url.replace('{{key}}', val), dict.method || 'GET', dict.params || {}, dict.data || {})
        } else {
          let temp = { key: val }
          const params = Object.assign(dict.params || {}, temp)
          const data   = Object.assign(dict.data || {}, temp)
          response = await requestDict(dict.url, dict.method || 'GET', params || {}, data || {})
        }
        if (response.data && response.code === 200) {
          formDictData.value[name][index] = response.data.map(dicItem => {
            return {
              'label': dicItem[ (dict.props && dict.props.label) || 'label'  ],
              'value': dicItem[ (dict.props && dict.props.value) || 'value' ]
            } 
          })
        } else {
          Message.error('字典联动请求失败：' + name)
          console.error(response)
        }
      }
    })
    loading.value = false
  }
}

const formItemShow = (item) => {
  if (typeof item.display == 'undefined' || item.display) {
    return true
  }
  return false
}

const getComponent = (item) => {
  if (!item.formType) {
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

init()

</script>