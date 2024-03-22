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
            <icon-upload class="text-5xl text-gray-400"/>
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
      show-text
      class="progress"
    />
    <span v-if="currentItem.percent < 100">上传中...</span>

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
    <a-progress
      v-if="file.percent < 100"
      :percent="file.percent"
      animation
      type="circle"
      size="mini"
      class="progress"
    />
    <span v-if="file.percent < 100">上传中...</span>

    <a-tooltip content="点击文件名预览/下载" position="tr">
      <a :href="file.url"
         v-if="file?.url && file.percent === 100 && file?.status === 'complete'"
         class="file-name"
         target="_blank"
      >{{ file.name }}</a>
    </a-tooltip>

    <a-button
      type="text"
      size="small"
      @click="removeFile(idx)"
      v-if="file.percent === 100"
    >
      <template #icon>
        <icon-delete/>
      </template>
    </a-button>
  </div>
</template>
<script setup>
import { ref, inject, watch } from 'vue'
import commonApi from '@/api/common'
import tool from '@/utils/tool'
import { isArray, throttle } from 'lodash'
import { getFileUrl } from '../js/utils'
import { Message } from '@arco-design/web-vue'
import file2md5 from 'file2md5'

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

const chunkUpload = async(options) => {
  let idx
  if(config.multiple) {
    showFileList.value.push(options.fileItem)
    idx = showFileList.value.length - 1
  } else {
    currentItem.value = options.fileItem
  }

  try {
    const file = options.fileItem.file
    const hash = await file2md5(file)
    if(!file.type) {
      Message.error('获取文件类型失败，无法上传')
      return
    }
    const chunks = Math.ceil(file.size / config.chunkSize)
    for(let currentChunk = 0; currentChunk < chunks; currentChunk++) {
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
      for(let name in config.requestData) {
        dataForm.append(name, config.requestData[name])
      }
      const res = await commonApi.chunkUpload(dataForm)

      if(res.data && res.data.hash) {
        res.data.url = tool.attachUrl(res.data.url, storageMode[res.data.storage_mode])
        if(config.multiple) {
          showFileList.value[idx].name = res.data.origin_name
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
      if(res.data && res.data.code && res.data.code === 201) {
        const percent = Math.floor((1 / chunks) * 10000) / 10000;
        if(config.multiple) {
          showFileList.value[idx].percent += percent
        } else {
          currentItem.value.status = 'uploading'
          currentItem.value.percent += percent
        }
      }
    }
  } catch(e) {
    console.error(e)
    Message.error(t('upload.fileHashFail'))
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

      let fileItemObj = { percent: 100, status: 'complete' };
      if(config.returnType === 'url') {
        showFileList.value = data.map(url => {
          return { url, name: url.substring(url.lastIndexOf('/') + 1), ...fileItemObj }
        })
      } else {
        showFileList.value = data.map(item => {
          return {
            name: item.origin_name,
            [config.returnType]: item[config.returnType],
            url: item.url,
            ...fileItemObj
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
      currentItem.value.name = (props.modelValue)?.substring((props.modelValue?.lastIndexOf('/') || 0) + 1)
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
