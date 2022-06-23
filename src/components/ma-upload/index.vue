<template>
  <div>
    <div class="upload-image" v-if="props.type === 'image'">
      <a-upload
        ref="uploadImage"
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
        <a-progress
          v-if="currentItem.status === 'uploading' && currentItem.percent < 100"
          :percent="currentItem.percent"
          type="circle"
          size="small"
          :style="{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
          }"
        />
        <a-button
          class="delete"
          @click="removeSignImage()"
          v-if="currentItem.percent === 100"
        >
          <template #icon><icon-delete /></template>
        </a-button>
        <a-image
          v-if="currentItem.percent === 100 && currentItem.status === 'complete'"
          width="130"
          height="130"
          :src="fileList.url ? fileList.url : (fileList ? fileList : currentItem.url)"
        />
      </div>
      <a-space v-else>
        <div class="image-list" v-if="! props.multiple && currentItem">
          <a-button class="delete"><icon-delete /></a-button>
          <a-image width="130" height="130" :src="currentItem.url" />
        </div>
      </a-space>
    </div>

    <div class="upload-file" v-if="props.type === 'file'">

    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import commonApi from '@/api/common'
import file2md5 from 'file2md5'
import { Message, Result } from '@arco-design/web-vue'
import { success, error } from '@/utils/common'
import tool from '@/utils/tool'
import { useI18n } from 'vue-i18n'
import { isString } from '@vue/shared'

const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: [ String, Object, Array ], default: () => {} },
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
  onlyUrl: { type: Boolean, default: true },
})

const fileList = ref()
const imagesList = ref([])
const accept = ref()
const currentItem = ref(null)
const storageMode = {
  '1': 'LOCAL',
  '2': 'OSS',
  '3': 'COS',
  '4': 'QINIU'
}

onMounted(() => {
  nextTick(() => {
    if (props.type === 'image' && props.accept !== '*') {
      accept.value = '.jpg,jpeg,.gif,.png,.svg,.bpm'
    } else {
      accept.value = props.accept
    }
  })
  if (isString(props.modelValue)) {
    fileList.value = props.modelValue
    currentItem.value = {
      status: 'complete',
      percent: 100
    }
  }
})

watch(
  () => props.modelValue,
  list => {
    fileList.value = list
  }
)

watch(
  () => fileList,
  value => {
    console.log(value)
    emit('update:modelValue', value)
  }
)

const uploadImage = ref()

const onProgress = progress => console.log('progress', progress);

const uploadImageHandler = async (options) => {
  if (! options.fileItem) return
  if (! props.multiple) {
    currentItem.value = options.fileItem
  }
  const file = options.fileItem.file
  if (! checkSize(file) && ! props.chunk) {
    Message.warning('文件大小超过上传限制')
    return
  }
  
  const result = await uploadRequest(file)

  if (result) {
    result.url = tool.viewImage(result.url, storageMode[result.storage_mode])
    if (! props.multiple) {
      fileList.value = props.onlyUrl ? result.url : result
      currentItem.value.percent = 99
      setTimeout(() => {
        currentItem.value.status = 'complete'
        currentItem.value.percent = 100
      }, 1000)
    }
  }
}

const uploadRequest = async (file) => {
  try {
    const hash = await file2md5(file)
    const dataForm = new FormData()
    dataForm.append('image', file)
    dataForm.append('isChunk', props.chunk ? true : false)
    dataForm.append('hash', hash)

    return commonApi.uploadImage(dataForm).then(response => {
      return response.data
    }).catch(e => {
      console.error(e)
      Message.error('文件上传失败')
      return false
    })
  } catch (e) {
    console.error(e)
    Message.error('获取文件hash失败，请重试！')
    return false
  }
}

const checkSize = file => file.size <= props.size

const removeSignImage = () => {
  currentItem.value = null
  fileList.value = undefined
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
  .icon, .title
  {
    color: var(--color-text-3);
  }
}

.image-list {
  cursor: pointer; position: relative;
  background-color: var(--color-fill-2);
  width: 130px; height: 130px;
  .delete {
    position: absolute; z-index: 99; right: 3px; top: 3px; display: none;
  }
}

.image-list:hover {
  .delete {
    display: block;
  }
}
.upload-skin:hover {
  border: 1px dashed rgb(var(--primary-6));
}
</style>

