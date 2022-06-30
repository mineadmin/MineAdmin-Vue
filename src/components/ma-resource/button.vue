<template>
  <div class="inline-block">
    <a-button type="primary" @click="visible = true"><icon-experiment /> 资源选择器</a-button>
    <a-modal v-model:visible="visible" :width="props.width" :footer="false"  draggable>
      <template #title>资源选择器</template>
      <ma-resource v-model="list" :multiple="props.multiple" :only-url="props.onlyUrl" />
    </a-modal>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'

  const list = ref()
  const visible = ref(false)

  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: { type: [ String, Array ] },
    multiple: { type: Boolean, default: true },
    onlyUrl: { type: Boolean, default: true },
    width: { type: String, default: '910px' },
  })

  onMounted(() => list.value = props.modelValue )

  watch(
    () => list.value,
    vl => {
      emit('update:modelValue', list.value)
      visible.value = false
    },
    { deep: true }
  )
</script>
