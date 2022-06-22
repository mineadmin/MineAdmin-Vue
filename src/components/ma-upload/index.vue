<template>
  <div>
    <div class="upload-image" v-if="props.type === 'image'">
      <a-upload
        ref="uploadImage"
        v-model:fileList="fileList"
        :custom-request="uploadImageHandler"
        :show-file-list="false"
        :multiple="props.multiple"
        :accept="accept"
        :disabled="props.disabled"
        :tip="props.tip"
        :draggable="props.draggable"
        :limit="props.limit"
        v-if="
          (
            !props.modelValue
            || props.modelValue.length === 0
            || props.multiple
          )
          && !currentItem
        "
      >
        <template #upload-button>
          <slot name="customer">
            <div
              :class="'upload-skin ' + (props.rounded ? 'rounded-full' : 'rounded-sm')"
            >
              <div class="icon text-3xl"><component :is="props.icon" /></div>
              <div class="title">{{ props.title }}</div>
            </div>
          </slot>
        </template>
      </a-upload>
      <div class="image-list" v-if="! props.multiple && currentItem">
        <a-image width="130" height="130" :src="currentItem.url" />
      </div>
    </div>

    <div class="upload-file" v-if="props.type === 'file'">

    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import commonApi from '@/api/common'
import { Message } from '@arco-design/web-vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Object|Array, default: () => {} },
  title: { type: String, default: '点击上传' },
  icon: { type: String, default: 'icon-plus'},
  rounded: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  size: { type: Number, default: 4 * 1024 * 1024 },
  chunk: { type: Boolean, default: false },
  chunkSize: { type: Number, default: 2 * 1024 * 1024 },
  limit: { type: Number, default: 0 },
  tip: { type: String, default: undefined },
  type: { type: String, default: 'image' },
  accept: { type: String, default: '*' },
})

const fileList = ref([])
const accept = ref()
const currentItem = ref(null)

onMounted(() => {
  nextTick(() => {
    if (props.type === 'image' && props.accept !== '*') {
      accept.value = '.jpg,jpeg,.gif,.png,.svg,.bpm'
    } else {
      accept.value = props.accept
    }
  })
})

watch(
  () => props.modelValue,
  list => fileList.value = list
)

watch(
  () => fileList,
  value => emits('update:modelValue', value)
)

const uploadImage = ref()

const uploadImageHandler = (options) => {
  if (! options.fileItem) return
  if (! props.multiple) {
    currentItem.value = options.fileItem
  }
  const file = options.fileItem.file
  if (! checkSize(file)) {
    Message.warning('文件大小超过上传限制')
    return
  }
}

const checkSize = file => file.size <= props.size

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
  .icon, .title
  {
    color: var(--color-text-3);
  }
}

.image-list {
  cursor: pointer;
}
.upload-skin:hover {
  border: 1px dashed rgb(var(--primary-6));
}
</style>

