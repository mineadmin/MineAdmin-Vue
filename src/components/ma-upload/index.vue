<template>
  <div>
    <a-upload
      ref="uploadRef"
      v-model:fileList="fileList"
      :custom-request="uploadHandler"
      :show-file-list="false"
      :multiple="props.multiple"
    >
      <template #upload-button>
        <slot name="customer">
          <div
            :class="'upload-skin ' + (props.rounded ? 'rounded-full' : 'rounded-sm')"
            v-if="!props.modelValue || props.modelValue.length === 0"
          >
            <div class="icon text-3xl"><component :is="props.icon" /></div>
            <div class="title">{{ props.title }}</div>
          </div>
        </slot>
      </template>
    </a-upload>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Object|Array, default: () => {} },
  title: { type: String, default: '点击上传' },
  icon: { type: String, default: 'icon-plus'},
  rounded: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false }
})

const fileList = ref([])

watch(
  () => props.modelValue,
  list => fileList.value = list
)

watch(
  () => fileList,
  value => emits('update:modelValue', value)
)

const uploadRef = ref()

const uploadHandler = (options) => {
  console.log(options)
}

</script>

<style scoped lang="scss">
.upload-skin {
  background-color: var(--color-fill-2);
  border: 1px dashed var(--color-fill-4);
  width: 130px; height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .icon,
  .title
  {
    color: var(--color-text-3);
  }
}
.upload-skin:hover {
  border: 1px dashed rgb(var(--primary-6));
}
</style>

