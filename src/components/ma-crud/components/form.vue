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
      <ma-form v-model="form" :columns="formColumns" :options="{ showButtons: false }" />
    </a-spin>
  </component>
</template>

<script setup>
import { ref, nextTick, watch, toRaw, getCurrentInstance, inject, provide } from 'vue'
import { request } from '@/utils/request'
import { Message } from '@arco-design/web-vue'
import commonApi from '@/api/common'
import { isArray, isFunction, concat, get } from 'lodash'

const app = getCurrentInstance().appContext.app
const componentName = ref('a-modal')
const columns = inject('columns')
const options = inject('options')
const layout = inject('layout')
const formColumns = ref([])
const currentAction = ref('')
const dataVisible = ref(false)
const form = ref({})
const crudForm = ref(null)
const actionTitle = ref('')
const dataLoading = ref(true)
const emit = defineEmits(['success', 'error'])

provide('form', toRaw(form))

const submit = async (done) => {
  return crudForm.value.validate()
  .then(async result => {
    if (result) {
      done(false)
      return false
    }
    let response
    if (currentAction.value === 'add') {
      isFunction(props.crud.beforeAdd) && await props.crud.beforeAdd(form.value)
      response = await props.crud.add.api(form.value)
      isFunction(props.crud.afterAdd) && await props.crud.afterAdd(response, form.value)
    } else {
      isFunction(props.crud.beforeEdit) && await props.crud.beforeEdit(form.value)
      response = await props.crud.edit.api(form.value[props.crud.pk], form.value)
      isFunction(props.crud.afterEdit) && await props.crud.afterEdit(response, form.value)
    }
    if ( response.success ) {
      Message.success(response.message || `${actionTitle.value}成功！`)
      emit('success', response)
      done(true)
      return true
    }
    done(false)
  })
}
const open = () => {
  nextTick(() => {
    init()
    componentName.value = options.formOption.viewType === 'drawer' ? 'a-drawer' : 'a-modal'
    dataVisible.value = true
  })
}
const close = () => {
  dataVisible.value = false
  formColumns.value = []
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

const init = () => {
  dataLoading.value = true
  columns.map(async item => {
    if (! formItemShow(item) || ['__index', '__operation'].includes(item.dataIndex)) return
    // 针对带点的数据处理
    if (item.dataIndex.indexOf('.') > -1) {
      form.value[item.dataIndex] = get(form.value, item.dataIndex)
    }
    
    // add 默认值处理
    if (currentAction.value === 'add') {
      if (item.addDefaultValue && isFunction(item.addDefaultValue)) {
        form.value[item.dataIndex] = await item.addDefaultValue(form.value)
      } else if (item.addDefaultValue) {
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
    if (item.display !== false) {
      item.display = formItemShow(item)
    }
    
    if (item.disabled !== false) {
      item.disabled = formItemDisabled(item)
    }

    if (item.readonly !== false) {
      item.readonly = formItemReadonly(item)
    }

    if (item.readonly !== false) {
      item.readonly = formItemReadonly(item)
    }

    if (! item.rules) {
      item.rules = getRules(item)
    }

    formColumns.value.push(item)
  })
  // 设置表单布局
  settingFormLayout(layout)
  
  if (layout.length > 0) {
    formColumns.value = layout
  }
  dataLoading.value = false
}

const settingFormLayout = (formLayout) => {
  formLayout.map(item => {
    if (formLayout.formList) {
      settingFormLayout(formLayout.formList)
    } else {
      columns.map(column => {
        if (column.dataIndex == item.dataIndex) {
          item = column
        }
      })
    }
  })
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
    return toRules(item.addRules ? item.addRules : item.rules || [])
  }
  if (currentAction.value === 'edit') {
    return toRules(item.editRules ? item.editRules : item.rules || [])
  }
}
defineExpose({ add, edit })
</script>