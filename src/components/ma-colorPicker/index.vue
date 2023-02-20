<template>
  <a-input-group class="w-full">
    <a-trigger position="bottom" trigger="click" auto-fit-position :unmount-on-close="false">
      <a-button type="primary">选择颜色</a-button>
      <template #content>
        <ColorPicker
          theme="dark"
          :color="val"
          :sucker-hide="true"
          :colors-default="defaultColorList"
          @changeColor="selectColor"
          style="width: 218px;"
        />
      </template>
    </a-trigger>
    <a-input v-model="val" :style="`color: ${val}`" readonly :placeholder="props.placeholder">
    </a-input>
    <a-tooltip content="复制">
      <a-button @click="copyColor"><template #icon><icon-copy class="cursor-pointer" /></template></a-button>
    </a-tooltip>
  </a-input-group>
</template>
<script setup>
import { ref, watch, reactive } from 'vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'
import { generate, getRgbStr } from '@arco-design/color'
import useClipboard from 'vue-clipboard3'
import { Message } from '@arco-design/web-vue'

const val = ref()
const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: '请选择颜色' },
})

const selectColor = (color) => {
  val.value = color.hex
}

const copyColor = async () => {
  try {
      await useClipboard().toClipboard(val.value)
      Message.success('复制成功')
    } catch(e) {
      Message.error('复制失败')
    }
}

const defaultColorList = reactive([
  '#165DFF', '#F53F3F', '#F77234', '#F7BA1E', '#00B42A', '#14C9C9', '#3491FA',
  '#722ED1', '#F5319D', '#D91AD9', '#34C759', '#43a047', '#7cb342', '#c0ca33',
  '#86909c', '#6d4c41',
])

const emit = defineEmits(['update:modelValue'])

watch(
  () => val.value,
  vl => emit('update:modelValue', vl)
)
</script>