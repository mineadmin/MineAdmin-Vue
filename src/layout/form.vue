<template>
  <div class="ma-content-block p-4">
    <a-page-header
      :style="{ background: 'var(--color-bg-2)' }"
      :title="pageTitle"
      :subtitle="`数据${opName}页`"
      @back="pageBack"
    >
      <ma-form v-model="form" :columns="formConfig?.formColumns ?? []" ref="maFormRef" @onSubmit="submitForm" />
    </a-page-header>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useFormStore, useTagStore } from '@/store/index'
import { useRoute } from 'vue-router'
import { isEmpty, isFunction } from 'lodash'
import { Message } from '@arco-design/web-vue'
import { closeTag  } from '@/utils/common'
import router from '@/router'

const route = useRoute()
const formStore = useFormStore()
const tagStore = useTagStore()
const maFormRef = ref()
const tagId = ref(route.query?.tagId ?? '')
const op = ref(route.query?.op ?? '')

if (isEmpty(tagId.value)) {
  Message.error('缺少tagId参数')
  closeTag({ path: route.fullPath })
}

if (isEmpty(op.value)) {
  Message.error('缺少op参数')
  closeTag({ path: route.fullPath })
}

if (! formStore.formList[tagId.value]) {
  Message.error('缺少Form配置')
  closeTag({ path: route.fullPath })
}

const formConfig = formStore.formList[tagId.value]
const form = ref(formConfig?.data)
const options = formConfig?.options
const opName = ref(op.value == 'add' ? '新增' : '编辑')
const pageTitle = ref(opName.value + (formConfig?.options?.formOption?.tagName ?? '未命名'))
tagStore.updateTagTitle(route.fullPath, pageTitle.value)

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
    isFunction(options.beforeAdd) && await options.beforeAdd(formData)
    response = await options.add.api(formData)
    isFunction(options.afterAdd) && await options.afterAdd(response, formData)
  } else {
    isFunction(options.beforeEdit) && await options.beforeEdit(formData)
    response = await options.edit.api(formData[options.pk], formData)
    isFunction(options.afterEdit) && await options.afterEdit(response, formData)
  }
  if ( response.success ) {
    Message.success(response.message || `${opName.value}成功！`)
  } else {
    Message.error(response.message)
  }
}
</script>
<script>
export default { name: 'openForm' }
</script>