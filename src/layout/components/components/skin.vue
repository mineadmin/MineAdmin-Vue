<template>
  <a-modal v-model:visible="visible" @ok="save" @cancel="close">
    <template #title>
      Title
    </template>
    <div>You can cusstomize modal body text by the current situation. This modal will be closed immediately once you press the OK button.</div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const open = () => visible.value = true
const close = () => visible.value = false

const save = () => {
  
}

defineExpose({ open })
</script>