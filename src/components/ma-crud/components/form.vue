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
    :width="options.formOption.width"
    :fullscreen="options.formOption.isFull || false"
    unmount-on-close
  >
    <template #title>{{ actionTitle }}</template>
    <a-spin :loading="dataLoading" tip="加载中..." class="w-full">
      <ma-form v-model="form" :columns="formColumns" :options="{ showButtons: false }" ref="maFormRef"/>
    </a-spin>
  </component>
</template>

<script setup>
import { ref, nextTick, watch, toRaw, getCurrentInstance, inject, provide } from 'vue'
import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'
import { containerItems } from '@cps/ma-form/js/utils'
import {isArray, isFunction, isEmpty, get, cloneDeep} from 'lodash'
import { useRouter } from 'vue-router'
import { useFormStore } from '@/store/index'

const formStore = useFormStore()
const router = useRouter()
const app = getCurrentInstance().appContext.app
const maFormRef = ref()
const componentName = ref('a-modal')
const columns = inject('columns')
const options = inject('options')
const formColumns = ref([])
const currentAction = ref('')
const dataVisible = ref(false)
const form = ref({})
const crudForm = ref(null)
const actionTitle = ref('')
const dataLoading = ref(true)
const emit = defineEmits(['success', 'error'])

provide('form', toRaw(form))

const submit = async () => {
  const formData = maFormRef.value.getFormData()
  if (await maFormRef.value.validateForm()) {
    return false
  }

  let response
  if (currentAction.value === 'add') {
    isFunction(options.beforeAdd) && await options.beforeAdd(formData)
    response = await options.add.api(formData)
    isFunction(options.afterAdd) && await options.afterAdd(response, formData)
  } else {
    isFunction(options.beforeEdit) && await options.beforeEdit(formData)
    response = await options.edit.api(formData[options.pk], formData)
    isFunction(options.afterEdit) && await options.afterEdit(response, formData)
  }
  if ( response.success ) {
    Message.success(response.message || `${actionTitle.value}成功！`)
    emit('success', response)
    return true
  }
}
const open = () => {
  formColumns.value = []
  init()
  if (options.formOption.viewType === 'tag') {
    if (! options.formOption.tagId ) {
      Message.info('未配置 tagId')
      return
    }
    if (! options.formOption.tagName ) {
      Message.info('未配置 tagName')
      return
    }
    const config = {
      options,
      data: cloneDeep(form.value),
      formColumns: formColumns.value
    }
    formStore.formList[options.formOption.tagId +'_'+ currentAction.value] = config
    form.value = {}
    router.push('/openForm?tagId=' + options.formOption.tagId + '_' + currentAction.value + '&op=' + currentAction.value)
  } else {
    componentName.value = options.formOption.viewType === 'drawer' ? 'a-drawer' : 'a-modal'
    dataVisible.value = true
  }
}
const close = () => {
  dataVisible.value = false
  formColumns.value = []
  form.value = {}
}
const add = () => {
  actionTitle.value = '新增'
  currentAction.value = 'add'
  form.value = {}
  open()
}
const edit = (data) => {
  actionTitle.value = '编辑'
  currentAction.value = 'edit'
  for (let i in data) form.value[i] = data[i]
  open(data)
}

const init = () => {
  dataLoading.value = true
  const layout = JSON.parse(JSON.stringify(options?.formOption?.layout ?? []))
  // const layout = options?.formOption?.layout ?? []
  const excludeColumns = ['__index', '__operation']
  if (options.formExcludePk) excludeColumns.push(options.pk)
  columns.map(async item => {
    if (! formItemShow(item) || excludeColumns.includes(item.dataIndex)) return
    formColumns.value.push(item)

    // 针对带点的数据处理
    if (item.dataIndex.indexOf('.') > -1) {
      form.value[item.dataIndex] = get(form.value, item.dataIndex)
    }
    
    // add 默认值处理
    if (currentAction.value === 'add') {
      if (item.addDefaultValue && isFunction(item.addDefaultValue)) {
        form.value[item.dataIndex] = await item.addDefaultValue(form.value)
      } else if (typeof item.addDefaultValue != 'undefined') {
        form.value[item.dataIndex] = item.addDefaultValue
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
    
    // 其他处理
    item.display = formItemShow(item)
    item.disabled = formItemDisabled(item)
    item.readonly = formItemReadonly(item)
    item.rules = getRules(item)
  })

  // 设置表单布局
  settingFormLayout(layout)


  if (isArray(layout) && layout.length > 0) {
    formColumns.value = layout
    columns.map(item => {
      if (! formItemShow(item) || ['__index', '__operation'].includes(item.dataIndex)) return
      ! item.__formLayoutSetting && formColumns.value.push(item)
    })
  }
  dataLoading.value = false
}

const settingFormLayout = (layout) => {
  if (!isArray(layout)) {
    return ;
  }
  layout.map((item, index) => {
    if ( containerItems.includes(item.formType) ) {
      switch ( item.formType ) {
        case 'tabs': 
          if ( item.tabs ) {
            item.tabs.map(tab => {
              tab.formList && settingFormLayout(tab.formList)
            })
          }
          break
        case 'card':
          item.formList && settingFormLayout(item.formList)
          break
        case 'grid-tailwind':
        case 'grid':
          if ( item.cols ) {
            item.cols.map(col => {
              col.formList && settingFormLayout(col.formList)
            })
          }
          break
        case 'table':
          if ( item.rows ) {
            item.rows.map(row => {
              if ( row.cols ) {
                row.cols.map(col => {
                  col.formList && settingFormLayout(col.formList)
                })
              }
            })
          }
          break
      }
    } else {
      columns.map((column, idx) => {
        if (column.dataIndex == item.dataIndex) {
          column['__formLayoutSetting'] = true
          item = column
          layout[index] = item
        }
      })
    }
  })
}

const formItemShow = (item) => {
  if (currentAction.value === 'add' && item?.addDisplay !== false) {
    return true
  }
  if (currentAction.value === 'edit' && item?.editDisplay !== false) {
    return true
  }
  return false
}
const formItemDisabled = (item) => {
  if (currentAction.value === 'add' && item?.addDisabled === true) {
    return true
  }
  if (currentAction.value === 'edit' && item?.editDisabled === true) {
    return true
  }
  return false
}
const formItemReadonly = (item) => {
  if (currentAction.value === 'add' && item?.addReadonly === true) {
    return true
  }
  if (currentAction.value === 'edit' && item?.editReadonly === true) {
    return true
  }
  return false
}

const toRules = (rules) => {

  if (!rules) {
    return []
  }

  if (isArray(rules)) {
    return rules.map(v => ({...v}))
  }
  
  if (!rules.validator && isFunction(rules.validatorFormData)) {
    rules.validator = (value, cb) => {
       rules.validatorFormData(value, cb, form.value)
    }
  }
  return {...rules}
}

const getRules = (item) => {
  if (currentAction.value === 'add') {
    return toRules(item.addRules ?? item.commonRules ?? [])
  }
  if (currentAction.value === 'edit') {
    return toRules(item.editRules ?? item.commonRules ?? [])
  }
}
defineExpose({ add, edit, currentAction, form })
</script>