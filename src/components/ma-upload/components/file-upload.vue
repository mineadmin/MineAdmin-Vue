<template>
  <div class="upload-file w-full">
    <a-upload
      :custom-request="uploadFileHandler"
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
              <icon-upload class="text-5xl text-gray-400"/>
              <div class="text-red-600 font-bold">
                {{ config.title === 'buttonText' ? $t('upload.buttonText') : config.title }}
              </div>
              将文件拖到此处，或<span style="color: #3370FF">点击上传</span>
            </div>
          </div>
        </slot>
      </template>
    </a-upload>
  </div>
  <!-- 单文件 -->
  <div
    class="file-list mt-2"
    v-if="! config.multiple && currentItem?.url && config.showList"
  >
    <a-tooltip content="点击文件名预览/下载" position="tr">
      <a :href="currentItem.url"
         v-if="currentItem?.url && currentItem.percent === 100 && currentItem?.status === 'complete'"
         class="file-name"
         target="_blank"
      >{{ currentItem.name }}</a>
    </a-tooltip>

    <a-button
      type="text"
      size="small"
      @click="removeSignFile()"
      v-if="currentItem.percent === 100"
    >
      <template #icon>
        <icon-delete/>
      </template>
    </a-button>
  </div>

  <!-- 多文件 -->
  <div
    v-if="config.showList"
    class="file-list mt-2"
    v-for="(file, idx) in showFileList" :key="idx"
  >
    <a-tooltip content="点击文件名预览/下载" position="tr">
      <a :href="file.url"
         v-if="file?.url"
         class="file-name"
         target="_blank"
      >{{ file.name }}</a>
    </a-tooltip>

    <a-button
      type="text"
      size="small"
      @click="removeFile(idx)"
    >
      <template #icon>
        <icon-delete/>
      </template>
    </a-button>
  </div>
</template>
<script setup>
import { ref, inject, watch } from 'vue'
import tool from '@/utils/tool'
import { isArray, throttle } from 'lodash'
import { getFileUrl, uploadRequest } from '../js/utils'
import { Message } from '@arco-design/web-vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: [String, Number, Array], default: () => {
    }
  }
})
const emit = defineEmits(['update:modelValue'])
const config = inject('config')
const storageMode = inject('storageMode')
const showFileList = ref([])
const signFile = ref()
const currentItem = ref({})

const uploadFileHandler = async(options) => {
  if(!options.fileItem) return
  if(!config.multiple) {
    currentItem.value = options.fileItem
  }
  const file = options.fileItem.file
  if(file.size > config.size) {
    Message.warning(file.name + ' ' + t('upload.sizeLimit'))
    currentItem.value = {}
    return
  }

  const result = await uploadRequest(file, 'file', 'uploadFile', config.requestData)

  if(result) {
    result.url = tool.attachUrl(result.url, storageMode[result.storage_mode])
    if(!config.multiple) {
      signFile.value = result[config.returnType]
      emit('update:modelValue', signFile.value)
      currentItem.value.url = result.url
    } else {
      showFileList.value.push(result)
      let files = []
      files = showFileList.value.map(item => {
        return item[config.returnType]
      })
      emit('update:modelValue', files)
    }
  }
}

const removeSignFile = () => {
  currentItem.value = {}
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

const init = throttle(async() => {
  if(config.multiple) {
    if(isArray(props.modelValue) && props.modelValue.length > 0) {
      const result = await props.modelValue.map(async item => {
        return await getFileUrl(config.returnType, item, storageMode)
      })
      const data = await Promise.all(result)
      if(config.returnType === 'url') {
        showFileList.value = data.map(url => {
          return { url, name: url.substring(url.lastIndexOf('/') + 1) }
        })
      } else {
        showFileList.value = data.map(item => {
          return {
            url: item.url,
            [config.returnType]: item[config.returnType],
            name: item.origin_name
          }
        })
      }
    } else {
      showFileList.value = []
    }
  } else if(props.modelValue) {
    if(config.returnType === 'url') {
      signFile.value = props.modelValue
      currentItem.value.url = props.modelValue
    } else {
      const result = await getFileUrl(config.returnType, props.modelValue, storageMode)
      signFile.value = result.url
      currentItem.value.url = result.url
      currentItem.value.name = result.origin_name
    }
    currentItem.value.percent = 100
    currentItem.value.status = 'complete'
  } else {
    removeSignFile()
  }
}, 1000);

watch(() => props.modelValue, (val) => {
  init()
}, {
  deep: true, immediate: true
})
</script>

<style lang="less" scoped>
.file-list {
  background-color: var(--color-primary-light-1);
  border-radius: 4px;
  height: 36px;
  padding: 0 5px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .file-name {
    max-width: 90%;
    margin: 0 5px;
    overflow: hidden;
    color: #165DFF
  }
}
</style>
