<template>
  <div class="upload-image flex">
    <!-- 单图 -->
    <div
      :class="'image-list ' + (config.rounded ? 'rounded-full' : '')"
      v-if="! config.multiple && currentItem && config.showList"
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
        v-if="currentItem.percent === 100 && currentItem?.status === 'complete'"
        width="130"
        height="130"
        :class="config.rounded ? 'rounded-full' : ''"
        :src="signFile.url ?? signFile ?? currentItem.url"
      />
    </div>
    <!-- 多图显示 -->
    <a-space
      v-else-if="config.multiple && !currentItem && config.showList"
      :class="isArray(fileList) && fileList.length > 0 ? 'mr-2' : ''"
    >
      <div
        :class="'image-list ' + (config.rounded ? 'rounded-full' : '')"
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
          v-if="file.percent == 100 && file.status === 'complete'"
          width="130"
          height="130"
          :class="config.rounded ? 'rounded-full' : ''"
          :src="file.url ?? file"
        />
      </div>
    </a-space>

    <a-upload
      :custom-request="uploadImageHandler"
      :show-file-list="false"
      :multiple="config.multiple"
      :accept="config.accept ?? '.jpg,jpeg,.gif,.png,.svg,.bpm'"
      :disabled="config.disabled"
      :tip="config.tip"
      :limit="config.limit"
    >
      <template #upload-button>
        <slot name="customer">
          <div
            :class="'upload-skin ' + (config.rounded ? 'rounded-full' : 'rounded-sm')"
            v-if="!props.modelValue || config.multiple"
          >
            <div class="icon text-3xl"><component :is="config.icon" /></div>
            <div class="title">
              {{ config.title === 'buttonText' ? $t('upload.buttonText') : config.title }}
            </div>
          </div>
        </slot>
      </template>
    </a-upload>
  </div>
</template>
<script setup>
import { ref, inject } from 'vue'
import commonApi from '@/api/common'
import file2md5 from 'file2md5'
import tool from '@/utils/tool'
import { isArray, isString } from 'lodash'
import { Message } from '@arco-design/web-vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: { type: [ String, Array, Object ], default: () => {} }
})
const emit = defineEmits(['update:modelValue'])
const config = inject('config')
const storageMode = inject('storageMode')
const fileList = ref([])
const signFile = ref()
const currentItem = ref()

if (config.multiple) {
  if (isArray(props.modelValue)) {
    props.modelValue.map(item => {
      const data = {
        percent: 100,
        status: 'complete',
      }
      fileList.value.push(Object.assign(data, isString(item) ? { url: item } : item))
    })
  }
} else {
  signFile.value = props.modelValue
}

const uploadImageHandler = async (options) => {
  if (! options.fileItem) return
  if (! config.multiple) {
    currentItem.value = options.fileItem
  }
  const file = options.fileItem.file
  if (file.size > config.size) {
    Message.warning(file.name + ' ' + t('upload.sizeLimit'))
    currentItem.value = undefined
    return
  }
  
  const result = await uploadRequest(file)

  if (result) {
    result.url = tool.attachUrl(result.url, storageMode[result.storage_mode])
    if (! config.multiple) {
      signFile.value = config.onlyData ? result[config.returnType] : result
      emit('update:modelValue', signFile.value)
      currentItem.value.percent = 99
      setTimeout(() => {
        currentItem.value.status = 'complete'
        currentItem.value.percent = 100
      }, 1000)
    } else {
      const index = fileList.value?.length ?? 0
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
        files.push(config.onlyData ? item[config.returnType] : item)
      })
      emit('update:modelValue', files)
    }
  }
}

const uploadRequest = async (file) => {
  const hash = await file2md5(file)
  const dataForm = new FormData()
  dataForm.append('image', file)
  dataForm.append('isChunk', false)
  dataForm.append('hash', hash)
  const response = await commonApi.uploadImage(dataForm)
  return response.data
}

const removeSignImage = () => {
  currentItem.value = undefined
  fileList.value = undefined
  emit('update:modelValue', null)
}

const removeImage = (idx) => {
  fileList.value.splice(idx, 1)
  let files = []
  fileList.value.map(item => files.push(item.url || item) )
  emit('update:modelValue', files)
}
</script>

<style lang="less" scoped>
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