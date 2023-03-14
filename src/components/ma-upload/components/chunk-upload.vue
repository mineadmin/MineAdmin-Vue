<template>
  <a-upload
    :custom-request="chunkUpload"
    :show-file-list="false"
    :multiple="config.multiple"
    :accept="config.accept"
    :disabled="config.disabled"
    :tip="config.tip"
    :draggable="config.draggable"
    :limit="config.limit"
  >
    <template #upload-button v-if="config.draggable">
      <slot name="customer">
        <div
          style="background-color: var(--color-fill-2); border: 1px dashed var(--color-fill-4);"
          class="rounded text-center p-7 w-full"
        >
          <div>
            <icon-upload class="text-5xl text-gray-400" />
            <div class="text-red-600 font-bold">
              {{ config.title === 'buttonText' ? $t('upload.buttonText') : config.title }}
            </div>
            {{ $t('upload.uploadDesc') }}<span style="color: #3370FF">{{ $t('upload.clickUpload') }}</span>
          </div>
        </div>
      </slot>
    </template>
  </a-upload>
    
    <!-- 单文件 -->
  <div
    class="file-list mt-2"
    v-if="!config.multiple && config.showList && currentItem?.percent"
  >
    <a-progress
      v-if="currentItem.percent < 100"
      :percent="currentItem.percent"
      animation
      type="circle"
      size="mini"
      class="progress"
    />
    <a-button
      class="delete"
      @click="removeSignFile()"
      v-if="currentItem.percent === 100"
    >
      <template #icon><icon-delete /></template>
    </a-button>
    <div
      v-if="currentItem?.url && currentItem.percent === 100 && currentItem?.status === 'complete'"
      class="file-item"
    >
      {{ currentItem.url }}
    </div>
  </div>

  <!-- 多文件 -->
  <div
    v-if="config.showList"
    class="file-list mt-2"
    v-for="(file, idx) in showFileList" :key="idx"
  >
    <a-progress
      v-if="file.percent < 100"
      :percent="file.percent"
      animation
      type="circle"
      size="mini"
      class="progress"
    />
    <a-button
      class="delete"
      @click="removeFile(idx)"
      v-if="file.percent === 100"
    >
      <template #icon><icon-delete /></template>
    </a-button>
    <div
      v-if="file?.url && file.percent === 100 && file?.status === 'complete'"
      class="file-item"
    >
      {{ file.url }}
    </div>
  </div>
</template>
<script setup>
import { ref, inject, watch } from 'vue'
import commonApi from '@/api/common'
import tool from '@/utils/tool'
import { isArray, isString, isEmpty } from 'lodash'
import { getFileUrl, uploadRequest } from '../js/utils'
import { Message } from '@arco-design/web-vue'
import file2md5 from 'file2md5'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: { type: [ String, Number, Array ], default: () => {} }
})
const emit = defineEmits(['update:modelValue'])
const config = inject('config')
const storageMode = inject('storageMode')
const showFileList = ref([])
const signFile = ref()
const currentItem = ref({})

const init = async () => {
  if (config.multiple) {
    if (isArray(props.modelValue)) {
      const tmp = []
      await props.modelValue.map(async item => {
        const res = await getFileUrl(config.returnType, item, storageMode)
        tmp.push({
          percent: 100,
          status: 'complete',
          url: res
        })
      })
      showFileList.value = tmp
    }
  } else if (props.modelValue) {
    signFile.value = props.modelValue
    getFileUrl(config.returnType, props.modelValue, storageMode).then(url => currentItem.value.url = url)
    currentItem.value.percent = 100
    currentItem.value.status  = 'complete'
  }
}

const chunkUpload = async (options) => {
  let idx
  if (config.multiple) {
    showFileList.value.push(options.fileItem)
    idx = showFileList.value.length - 1
  } else {
    currentItem.value = options.fileItem
  }

  try {
    const file = options.fileItem.file
    const hash = await file2md5(file)
    if (! file.type) {
      Message.error('获取文件类型失败，无法上传')
      return
    }
    const chunks = Math.ceil(file.size / config.chunkSize)
    for (let currentChunk = 0; currentChunk < chunks; currentChunk++) {
      const start = currentChunk * config.chunkSize
      const end = (start + config.chunkSize >= file.size)
                  ? file.size
                  : start + config.chunkSize
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
        if (config.multiple) {
          showFileList.value[idx].percent = 100
          showFileList.value[idx].status = 'complete'
          showFileList.value[idx].url = res.data.url
          showFileList.value[idx][config.returnType] = res.data[config.returnType]
          let files = []
          files = showFileList.value.map(item => {
            return item[config.returnType]
          })
          emit('update:modelValue', files)
        } else {
          signFile.value = res.data[config.returnType]
          emit('update:modelValue', signFile.value)
          currentItem.value.url = res.data.url
          currentItem.value.percent = 99
          setTimeout(() => {
            currentItem.value.status = 'complete'
            currentItem.value.percent = 100
          }, 1000)
        }
        return
      }
      if (res.data && res.data.code && res.data.code === 201) {
        const percent = parseFloat((1 / chunks).toFixed(2))
        if (config.multiple) {
          showFileList.value[idx].percent += percent
        } else {
          currentItem.value.status = 'uploading'
          currentItem.value.percent += percent
        }
      }
    }
  } catch (e) {
    console.error(e)
    Message.error(t('upload.fileHashFail'))
  }
}

const removeSignFile = () => {
  currentItem.value = undefined
  signFile.value = undefined
  emit('update:modelValue', null)
}

const removeFile = (idx) => {
  showFileList.value.splice(idx, 1)
  let files = []
  files = showFileList.value.map(item => {
    return item[config.returnType]
  })
  emit('update:modelValue', files)
}
watch(() => props.modelValue, (val) => {
  init()
}, {
  deep: true, immediate: true
})
</script>
<style lang="less" scoped>
.file-list {
  position: relative;
  background-color: var(--color-primary-light-1);
  border-radius: 4px;
  height: 36px; line-height: 36px; padding: 0 10px;
  width: 100%;
  .delete {
    position: absolute; z-index: 99; right: 2px; top: 2px;
  }

  .progress {
    position: absolute;
    left: 30px;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>