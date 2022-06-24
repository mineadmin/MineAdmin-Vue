<template>
  <div>
    <div class="upload-image flex" v-if="props.type === 'image'">
      <div class="image-list" v-if="! props.multiple && currentItem">
        <a-progress
          v-if="currentItem.status === 'uploading' && currentItem.percent < 100"
          :percent="currentItem.percent"
          animation
          type="circle"
          size="small"
          class="progress"
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
      <a-space v-else class="mr-2">
        <div class="image-list" v-for="(file, idx) in fileList" :key="idx">
          <a-progress
            v-if="file.status === 'uploading' && file.percent < 100"
            :percent="file.percent"
            animation
            type="circle"
            size="small"
            class="progress"
          />
          <a-button
            class="delete"
            @click="removeImage(idx)"
            v-if="file.percent === 100"
          >
            <template #icon><icon-delete /></template>
          </a-button>
          <a-image
            v-if="file.percent === 100 && file.status === 'complete'"
            width="130"
            height="130"
            :src="file.url ? file.url : file"
          />
        </div>
      </a-space>

      <a-upload
        ref="uploadImage"
        :custom-request="uploadImageHandler"
        :show-file-list="false"
        :multiple="props.multiple"
        :accept="accept"
        :disabled="props.disabled"
        :tip="props.tip"
        :limit="props.limit"
        v-if="
          (
            !props.modelValue
            || props.modelValue.length === 0
            || props.multiple
          )
          || !currentItem
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
      
    </div>

    <div class="upload-file" v-if="props.type === 'file'">
      <a-upload
        ref="uploadFile"
        :custom-request="uploadFileHandler"
        show-file-list
        :multiple="props.multiple"
        :accept="accept"
        :disabled="props.disabled"
        :tip="props.tip"
        :draggable="draggable"
        :limit="props.limit"
        :show-retry-button="false"
        :show-cancel-button="false"
        @before-remove="removeFile"
      >
        <template #upload-button v-if="props.fileType === 'drag'">
          <slot name="customer">
            <div
              style="background-color: var(--color-fill-2); border: 1px dashed var(--color-fill-4);"
              class="rounded text-center p-7 w-full"
            >
              <div>
                <icon-upload class="text-5xl text-gray-400" />
                <div class="text-red-600 font-bold">文件上传</div>
                将文件拖到此处，或<span style="color: #3370FF">点击上传</span>
              </div>
            </div>
          </slot>
        </template>
      </a-upload>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import commonApi from '@/api/common'
import file2md5 from 'file2md5'
import { Message, } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import { useI18n } from 'vue-i18n'
import { isArray, isObject, isString } from '@vue/shared'

const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: [ String, Object, Array ], default: () => {} },
  title: { type: String, default: '点击上传' },
  icon: { type: String, default: 'icon-plus'},
  rounded: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: Number, default: 4 * 1024 * 1024 },
  chunk: { type: Boolean, default: false },
  chunkSize: { type: Number, default: 1 * 1024 * 1024 },
  limit: { type: Number, default: 0 },
  tip: { type: String, default: undefined },
  type: { type: String, default: 'image' },
  accept: { type: String, default: '*' },
  onlyUrl: { type: Boolean, default: true },
  fileType: { type: String, default: 'button' },
})

const fileList = ref()
const accept = ref()
const draggable = ref(false)
const uploadFile = ref()
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

  if (props.type === 'file' && props.fileType === 'drag') {
    draggable.value = true
  }

  if (props.multiple) {
    fileList.value = []
  }

  if (props.type === 'image' && (isString(props.modelValue) || isObject(props.modelValue))) {
    fileList.value = props.modelValue
    currentItem.value = {
      status: 'complete',
      percent: 100
    }
  }

  if (props.type === 'image' && isArray(props.modelValue)) {
    fileList.value = []
    props.modelValue.map(item => {
      if (isObject(item)) {
        item.status = 'complete'
        item.percent = 100
        fileList.value.push(item)
      } else {
        fileList.value.push({ status: 'complete', percent: 100, url: item })
      }
    })
  }
})

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
  
  const result = await uploadRequest(options)

  if (result) {
    result.url = tool.attachUrl(result.url, storageMode[result.storage_mode])
    if (! props.multiple) {
      fileList.value = props.onlyUrl ? result.url : result
      emit('update:modelValue', fileList.value)
      currentItem.value.percent = 99
      setTimeout(() => {
        currentItem.value.status = 'complete'
        currentItem.value.percent = 100
      }, 1000)
    } else {
      const index = fileList.value.length
      result.status = 'uploading'
      result.percent = 0
      fileList.value.push(result)
      setTimeout(() => { fileList.value[index].percent = 99 }, 500)
      setTimeout(() => {
        fileList.value[index].status = 'complete'
        fileList.value[index].percent = 100
      }, 1200)
      let files = []
      fileList.value.map(item => {
        files.push(props.onlyUrl ? item.url : item)
      })
      emit('update:modelValue', files)
    }
  }
}

const uploadFileHandler = async (options) => {
  const { onError, onSuccess, fileItem } = options
  if (! checkSize(fileItem.file) && ! props.chunk) {
    Message.warning('文件大小超过上传限制')
    uploadFile.value.abort(fileItem)
    return false
  }
  
  uploadRequest(options).then(res => {
    res ? onSuccess(res) : onError(res)
    res.url = tool.attachUrl(res.url, storageMode[res.storage_mode])
    if (props.multiple) {
      let files = []
      fileList.value.push(res)
      fileList.value.map(item => {
        files.push(props.onlyUrl && item.url ? item.url : item)
      })
      emit('update:modelValue', files)
    } else {
      fileList.value = res
      emit('update:modelValue', props.onlyUrl && res.url ? res.url : res)
    }
  })
}

const uploadRequest = async (options) => {
  const { onProgress, fileItem } = options
  try {
    const hash = await file2md5(fileItem.file)
    const dataForm = new FormData()
    const field = props.type === 'image' ? 'image' : 'file'
    dataForm.append(field, fileItem.file)
    dataForm.append('isChunk', props.chunk ? true : false)
    dataForm.append('hash', hash)

    const api = props.type === 'image' ? commonApi.uploadImage : commonApi.uploadFile

    if (! props.chunk) {

      return api(dataForm).then(response => {
        return response.data
      }).catch(e => {
        console.error(e)
        Message.error('文件上传失败')
        return false
      })

    // 分片上传
    } else {
      const slice = File.prototype.slice
      const chunks = Math.ceil(fileItem.file.size / props.chunkSize)
      
      return { url: '' }
    }
  } catch (e) {
    console.error(e)
    Message.error('获取文件hash失败，请重试！')
    return false
  }
}

const checkSize = file => file.size < props.size

const removeFile = async (fileItem) => {
  try {
    const hash = await file2md5(fileItem.file)
    if (props.multiple) {
      let files = []
      fileList.value.map( (item, idx) => {
        if (item.hash === hash) fileList.value.splice(idx, 1)
      })
      fileList.value.map( item => {
        files.push(props.onlyUrl && item.url ? item.url : item)
      })
      emit('update:modelValue', files)
      return true
    } else if (fileList.value.hash === hash) {
      fileList.value = undefined
      emit('update:modelValue', undefined)
      return true
    }
    return false
  } catch (e) {
    console.error(e)
    Message.error('获取文件hash失败，请重试！')
    return false;
  }
}

const removeSignImage = () => {
  currentItem.value = undefined
  fileList.value = undefined
  emit('update:modelValue', undefined)
}

const removeImage = (idx) => {
  fileList.value.splice(idx, 1)
  let files = []
  fileList.value.map(item => files.push(item.url || item) )
  emit('update:modelValue', files)
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

  .progress {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
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

