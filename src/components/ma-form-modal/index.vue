<template>
  <a-modal
    v-model:visible="modal.visible"
    :on-before-ok="modal.submit"
    unmount-on-close
    @cancel="modal.cancel"
  >
    <template #title>
      {{ prop.title }}
    </template>
    <slot name="body"></slot>
    <ma-form
      ref="maFormRef"
      :columns="prop.column"
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

import { reactive, ref, watch } from "vue";
const emit = defineEmits(["visible", "validateError", "open", "cancel", "close"]);
const form = ref({});
const prop = defineProps({
  title: { type: String, default: "" }, // 弹出框标题
  column: { type: Array, default: [] }, // ma-form字段
  default_visible: { type: Boolean, default: false }, // 默认隐藏
  options: { type: Object, default: {} }, // ma-form 属性
  submit: { type: Function, default: () => {} },
});

const maFormRef = ref();

const modal = reactive({
  visible: prop.default_visible,
  open(data) {
    modal.visible = true;
    emit("open", data);
  },
  close() {
    modal.visible = false;
  },
  async submit() {
    let validate = await maFormRef.value.formRef.validate();
    if (validate) {
      emit("validateError", validate);
      return false;
    }
    return prop.submit(form._rawValue);
  },
  cancel() {
    emit("cancel");
  },
});

watch(
  () => modal.visible,
  (vl) => {
    emit("visible", modal.visible);
  },
  { immediate: true }
);

defineExpose({
  open: modal.open,
  close: modal.close,
  formData: form,
  form: maFormRef,
});
</script>

<style scoped></style>
