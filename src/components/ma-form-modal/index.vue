<template>
  <a-modal
    :width="prop.width"
    :fullscreen="isFull"
    v-model:visible="modal.visible"
    :on-before-ok="modal.submit"
    unmount-on-close
    @cancel="modal.cancel"
  >
    <template #title>
      {{ prop.title }}
    </template>
    <slot name="body"></slot>
    <a-space
      v-if="prop.infoColumns.length"
    >
      <ma-info
          :columns="prop.infoColumns"
          :data="prop.infoData"
      />
    </a-space>
    <ma-form
      ref="maFormRef"
      :columns="formColumns"
      v-model="form"
      :options="{ ...options, showButtons: false }"
    />
  </a-modal>
</template>

<script setup>
/**
 * 组件 - 弹窗form组件
 * 事件
 *  @visible(show = true|false) 显示关闭事件
 */
import { reactive, ref, watch } from "vue"
import MaForm from "@/components/ma-form/index.vue"
import {Message} from "@arco-design/web-vue"
import MaInfo from "@/components/ma-info/index.vue"
import {setModalSizeEvent} from "@/utils/common";

const emit = defineEmits(["visible", "validateError", "open", "cancel", "close"])
const form = ref({})
const formColumns = ref([])
const prop = defineProps({
  width: {type: Number, default: 1200}, // modal框大小
  isFull: { type: Boolean, default: false,}, // 是否全屏
  title: { type: String, default: "" }, // 弹出框标题
  column: { type: Array, default: []}, // ma-form字段
  columns: {type: Array, default: []}, // ma-form字段 别名
  infoColumns: {type: Array, default: []},
  infoData: {type: Object, default:{}},
  default_visible: { type: Boolean, default: false }, // 默认隐藏
  options: { type: Object, default: {} }, // ma-form 属性
  submit: { type: Function, default: () => {} },
})

const isFull = ref(prop.isFull)
setModalSizeEvent((config) => {
  isFull.value = config.isFull
})

formColumns.value = [...prop.column, ...prop.columns]
let submitEvent = prop.submit

const maFormRef = ref()

const modal = reactive({
  visible: prop.default_visible,
  open(formData, infoData = {}) {
    modal.visible = true
    for (let [key, value] of Object.entries(formData)) {
      form.value[key] = value
    }
    for (let [key, value] of Object.entries(infoData)) {
      prop.infoData[key] = value
    }
    emit("open", formData, infoData)
  },
  onSubmit(func)
  {
    submitEvent = func
    return this
  },
  close() {
    modal.visible = false
  },
  async submit() {
    let validate = await maFormRef.value.validateForm()
    if (validate) {
      emit("validateError", validate)
      return false
    }
    return submitEvent(form._rawValue)
  },
  cancel() {
    emit("cancel")
  },
})

watch(
  () => modal.visible,
  (vl) => {
    emit("visible", modal.visible)
  },
  { immediate: true }
)

const getAttr = (key) => {
  return form.value[key]
}

defineExpose({
  open: modal.open,
  close: modal.close,
  form: form,
  getAttr,
  formRef: maFormRef,
  onSubmit: modal.onSubmit,
})
</script>

<style scoped></style>
