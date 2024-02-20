<template>
  <div class="ma-content-block p-4">
    <a-page-header
      :style="{ background: 'var(--color-bg-2)' }"
      :title="pageTitle"
      :subtitle="`数据${opName}页`"
      @back="pageBack"
    >
      <ma-form v-model="form" :columns="formConfig?.formColumns ?? []" ref="maFormRef" @submit="submitForm" />
    </a-page-header>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useFormStore, useTagStore } from '@/store/index'
import { useRoute } from 'vue-router'
import { isEmpty, isFunction, get } from 'lodash'
import { Message } from '@arco-design/web-vue'
import { closeTag  } from '@/utils/common'

const route = useRoute()
const formStore = useFormStore()
const tagStore = useTagStore()
const maFormRef = ref()
const tagId = ref(route.query?.tagId ?? '')
const op = ref(route.query?.op ?? '')
const key = ref(route.query?.key ?? '')

if (isEmpty(tagId.value)) {
  Message.error('缺少tagId参数')
  closeTag({ path: route.fullPath })
}

if (isEmpty(op.value)) {
  Message.error('缺少op参数')
  closeTag({ path: route.fullPath })
}

if (op.value === 'edit' && isEmpty(key.value)) {
  Message.error('缺少key参数')
  closeTag({ path: route.fullPath })
}

if (! formStore.formList[tagId.value]) {
  Message.error('缺少Form配置')
  closeTag({ path: route.fullPath })
}

const formConfig = formStore.formList[tagId.value]?.config
const form = ref(op.value === 'add' ? formStore.formList[tagId.value]?.addData : formStore.formList[tagId.value]['editData'][key.value])
const options = formConfig?.options
const opName = ref(op.value === 'add' ? '新增' : '编辑' )
const pageTitle = ref(opName.value + (formConfig?.options?.formOption?.tagName ?? '未命名') )
tagStore.updateTagTitle(route.fullPath, ` ${pageTitle.value} ${op.value === 'edit' ? ' | ' + key.value : '' } `)

formConfig.sourceColumns.map(async item => {
  // 针对带点的数据处理
  if (item.dataIndex && item.dataIndex.indexOf('.') > -1) {
    form.value[item.dataIndex] = get(form.value, item.dataIndex)
  }

  // add 默认值处理
  if (op.value === 'add') {
    if (item.addDefaultValue && isFunction(item.addDefaultValue)) {
      form.value[item.dataIndex] = await item.addDefaultValue(form.value)
    } else if (typeof item.addDefaultValue != 'undefined') {
      form.value[item.dataIndex] = item.addDefaultValue
    }
  }
  // edit 默认值处理
  if (op.value === 'edit') {
    if (item.editDefaultValue && isFunction(item.editDefaultValue)) {
      form.value[item.dataIndex] = await item.editDefaultValue(form.value)
    } else if (typeof item.editDefaultValue != 'undefined') {
      form.value[item.dataIndex] = item.editDefaultValue
    }
  }
})

const pageBack = () => {
  window.history.back(-1)
}

const submitForm = async () => {
  const formData = maFormRef.value.getFormData()
  if (await maFormRef.value.validateForm()) {
    return false
  }

  let response
  if (op.value === 'add') {
    if (isFunction(options.beforeAdd) && ! await options.beforeAdd(formData)) {
      return false
    }
    response = await options.add.api(formData)
    isFunction(options.afterAdd) && await options.afterAdd(response, formData)
  } else {
    if (isFunction(options.beforeEdit) && ! await options.beforeEdit(formData)) {
      return false
    }
    response = await options.edit.api(formData[options.pk], formData)
    isFunction(options.afterEdit) && await options.afterEdit(response, formData)
  }
  if ( response.success ) {
    await maFormRef.value.resetForm()
    Message.success(response.message || `${opName.value}成功！`)
    closeTag({ path: route.fullPath })
    formStore.crudList[options.id] = true
  } else if ( response.success === false && (typeof response.code === "undefined" || response.code !== 200) ) {
    Message.clear()
    Message.error(response.message || `${actionTitle.value}失败！`)
  }

}
</script>