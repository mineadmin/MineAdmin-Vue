<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="inline-block">
    <div class="upload-image flex" v-if="props.type === 'image' && !props.chunk">
      <div
        :class="'image-list ' + (props.rounded ? 'rounded-full' : '')"
        v-if="! props.multiple && currentItem && props.showList"
      >
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
          :class="props.rounded ? 'rounded-full' : ''"
          :src="fileList.url ? fileList.url : (fileList ? fileList : currentItem.url)"
        />
      </div>
      <a-space
        v-else-if="props.multiple && !currentItem && props.showList"
        :class="isArray(fileList) && fileList.length > 0 ? 'mr-2' : ''"
      >
        <div
          :class="'image-list ' + (props.rounded ? 'rounded-full' : '')"
          v-for="(file, idx) in fileList" :key="idx"
        >
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
            :class="props.rounded ? 'rounded-full' : ''"
            :src="file.url ? file.url : file"
          />
        </div>
      </a-space>

      <a-upload
        :custom-request="uploadImageHandler"
        :show-file-list="false"
        :multiple="props.multiple"
        :accept="accept"
        :disabled="props.disabled"
        :tip="props.tip"
        :limit="props.limit"
      >
        <template #upload-button>
          <slot name="customer">
            <div
              :class="'upload-skin ' + (props.rounded ? 'rounded-full' : 'rounded-sm')"
              v-if="
                (
                  !props.modelValue
                  || props.modelValue.length === 0
                  || props.multiple
                )
                || !currentItem
              "
            >
              <div class="icon text-3xl"><component :is="props.icon" /></div>
              <div class="title">
                {{ props.title === 'buttonText' ? $t('upload.buttonText') : props.title }}
              </div>
            </div>
          </slot>
        </template>
      </a-upload>
    </div>

    <div class="upload-file" v-if="props.type === 'file' && !props.chunk">
      <a-upload
        :custom-request="uploadFileHandler"
        :show-file-list="props.showList"
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
                <div class="text-red-600 font-bold">
                  {{ props.title === 'buttonText' ? $t('upload.buttonText') : props.title }}
                </div>
                将文件拖到此处，或<span style="color: #3370FF">点击上传</span>
              </div>
            </div>
          </slot>
        </template>
      </a-upload>
    </div>

    <div class="chunk" v-if="props.chunk">
      <a-upload
        :custom-request="chunkUpload"
        :show-file-list="false"
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
                <div class="text-red-600 font-bold">
                  {{ props.title === 'buttonText' ? $t('upload.buttonText') : props.title }}
                </div>
                {{ $t('upload.uploadDesc') }}<span style="color: #3370FF">{{ $t('upload.clickUpload') }}</span>
              </div>
            </div>
          </slot>
        </template>
      </a-upload>
      <div class="chunk-upload-list mt-3" v-if="fileList && props.showList">
        <a-space direction="vertical" fill>
          <template v-if="props.multiple">
            <div
              class="chunk-file-list flex flex-col"
              v-for="item in fileList"
              :key="item.uid"
            >
              <div class="flex justify-between items-center">
                <div>{{ item.name }}</div>
                <a-button shape="circle" @click="removeChunkFile(item)">
                  <template #icon><icon-delete /></template>
                </a-button>
              </div>
              <a-progress animation :percent="item.percent || 0" class="mt-2"/>
            </div>
          </template>
          <div
            v-else
            class="chunk-file-list flex flex-col"
          >
            <div class="flex justify-between items-center">
              <div>{{ fileList.file.name }}</div>
              <a-button shape="circle" @click="removeChunkFile">
                <template #icon><icon-delete /></template>
              </a-button>
            </div>
            <a-progress animation :percent="fileList.percent || 0" class="mt-2"/>
          </div>
        </a-space>
      </div>
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
  title: { type: String, default: 'buttonText', },
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
  showList: { type: Boolean, default: true },
})

const fileList = ref()
const accept = ref()
const draggable = ref(false)
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

  if ((props.type === 'file' || props.chunk) && props.fileType === 'drag') {
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

const uploadImageHandler = async (options) => {
  if (! options.fileItem) return
  if (! props.multiple) {
    currentItem.value = options.fileItem
  }
  const file = options.fileItem.file
  if (! checkSize(file)) {
    Message.warning(file.name + ' ' + t('upload.sizeLimit'))
    currentItem.value = undefined
    return
  }
  
  const result = await uploadRequest(file)

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
  if (! checkSize(fileItem.file)) {
    Message.warning(fileItem.file.name + ' ' + t('upload.sizeLimit'))
    return false
  }
  
  uploadRequest(fileItem.file).then(res => {
    res ? onSuccess(res) : onError(res)
    res.url = tool.attachUrl(res.url, storageMode[res.storage_mode])
    res.uid = fileItem.uid
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

const chunkUpload = async (options) => {
  let idx
  if (props.multiple) {
    fileList.value.push(options.fileItem)
    idx = fileList.value.length - 1
  } else {
    fileList.value = options.fileItem
  }

  try {
    const file = options.fileItem.file
    const hash = await file2md5(file)
    if (! file.type) {
      Message.error('获取文件类型失败，无法上传')
      return
    }
    const chunks = Math.ceil(file.size / props.chunkSize)
    for (let currentChunk = 0; currentChunk < chunks; currentChunk++) {
      const start = currentChunk * props.chunkSize
      const end = (start + props.chunkSize >= file.size)
                  ? file.size
                  : start + props.chunkSize
      const dataForm = new FormData()
      dataForm.append('package', file.slice(start, end))
      dataForm.append('hash', hash)
      dataForm.append('total', chunks)
      dataForm.append('name', file.name)
      dataForm.append('type', file.type)
      dataForm.append('size', file.size)
      dataForm.append('index', currentChunk + 1)
      dataForm.append('ext', /[^.]+$/g.exec(file.name)[0])
      const res = await commonApi.chunkUpload(dataForm)

      if (res.data && res.data.hash) {
        res.data.url = tool.attachUrl(res.data.url, storageMode[res.data.storage_mode])
        if (props.multiple) {
          fileList.value[idx].percent = 1
          fileList.value[idx].res = res.data
          const files = []
          fileList.value.map(item => {
            item.percent === 1 && files.push(props.onlyUrl ? item.res.url : item.res)
          })
          emit('update:modelValue', files)
        } else {
          fileList.value.percent = 1
          emit('update:modelValue', props.onlyUrl ? res.data.url : res.data)
        }
        return
      }
      if (res.data && res.data.code && res.data.code === 201) {
        const percent = parseFloat((1 / chunks).toFixed(2))
        if (props.multiple) {
          fileList.value[idx].percent += percent
        } else {
          fileList.value.percent += percent
        }
      }
    }
  } catch (e) {
    console.error(e)
    Message.error(t('upload.fileHashFail'))
  }
}

const uploadRequest = async (file) => {
  try {
    const hash = await file2md5(file)
    const dataForm = new FormData()
    const field = props.type === 'image' ? 'image' : 'file'
    dataForm.append(field, file)
    dataForm.append('isChunk', false)
    dataForm.append('hash', hash)

    const api = props.type === 'image' ? commonApi.uploadImage : commonApi.uploadFile


      return api(dataForm).then(response => {
        return response.data
      }).catch(e => {
        console.error(e)
        Message.error(t('upload.uploadFailed'))
        return false
      })
  } catch (e) {
    console.error(e)
    Message.error(t('upload.fileHashFail'))
    return false
  }
}

const checkSize = file => file.size < props.size

const removeChunkFile = (file = null) => {
  if (props.multiple) {
    const files = []
    fileList.value.map( (item, idx) => {
      if (file.uid === item.uid) {
        fileList.value.splice(idx, 1)
      } else if (item.res) {
        files.push(props.onlyUrl ? item.res.url : item.res)
      }
    })
    emit('update:modelValue', files)
  } else {
    fileList.value = undefined
    emit('update:modelValue', undefined)
  }
}

const removeFile = async (fileItem) => {
  try {
    if (props.multiple) {
      let files = []
      fileList.value.map( (item, idx) => {
        if (item.uid === fileItem.uid) fileList.value.splice(idx, 1)
      })
      fileList.value.map( item => {
        files.push(props.onlyUrl && item.url ? item.url : item)
      })
      emit('update:modelValue', files)
      return true
    } else {
      fileList.value = undefined
      emit('update:modelValue', undefined)
      return true
    }
  } catch (e) {
    console.error(e)
    Message.error(t('upload.fileHashFail'))
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

<style scoped lang="less">
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

