<template>
  <div class="upload-image flex">
    <!-- 单图 -->
    <div
      :class="'image-list ' + (config.rounded ? 'rounded-full' : '')"
      v-if="! config.multiple && currentItem?.url && config.showList"
    >
      <a-button
        class="delete"
        @click="removeSignImage()"
      >
        <template #icon><icon-delete /></template>
      </a-button>
      <a-image
        width="130"
        height="130"
        :class="config.rounded ? 'rounded-full' : ''"
        :src="currentItem.url"
      />
    </div>
    <!-- 多图显示 -->
    <a-space
      v-else-if="config.multiple && config.showList"
      :class="showImgList.length > 0 ? 'mr-2' : ''"
    >
      <div
        :class="'image-list ' + (config.rounded ? 'rounded-full' : '')"
        v-for="(image, idx) in showImgList" :key="idx"
      >
        <a-button
          class="delete"
          @click="removeImage(idx)"
        >
          <template #icon><icon-delete /></template>
        </a-button>
        <a-image
          width="130"
          height="130"
          :class="config.rounded ? 'rounded-full' : ''"
          :src="image.url"
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
import { ref, inject, watch } from 'vue'
import commonApi from '@/api/common'
import tool from '@/utils/tool'
import { isArray, isString, isEmpty } from 'lodash'
import { getFileUrl, uploadRequest } from '../js/utils'
import { Message } from '@arco-design/web-vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  modelValue: { type: [ String, Number, Array ], default: () => {} }
})
const emit = defineEmits(['update:modelValue'])
const config = inject('config')
const storageMode = inject('storageMode')
const showImgList = ref([])
const signImage = ref()
const currentItem = ref({})

const init = async () => {
  if (config.multiple) {
    if (isArray(props.modelValue)) {
      const tmp = []
      await props.modelValue.map(async item => {
        const res = await getFileUrl(config.returnType, item, storageMode)
        tmp.push({ url: res })
      })
      showImgList.value = tmp
    }
  } else if (props.modelValue) {
    signImage.value = props.modelValue
    getFileUrl(config.returnType, props.modelValue, storageMode).then(url => currentItem.value.url = url)
    currentItem.value.percent = 100
    currentItem.value.status  = 'complete'
  }
}

watch(() => props.modelValue, (val) => {
  init()
}, {
  deep: true, immediate: true
})

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
  
  const result = await uploadRequest(file, 'image', 'uploadImage')

  if (result) {
    result.url = tool.attachUrl(result.url, storageMode[result.storage_mode])
    if (! config.multiple) {
      signImage.value = result[config.returnType]
      emit('update:modelValue', signImage.value)
    } else {
      showImgList.value.push(result)
      let files = []
      files = showImgList.value.map(item => {
        return item[config.returnType]
      })
      emit('update:modelValue', files)
    }
  }
}

const removeSignImage = () => {
  currentItem.value = undefined
  signImage.value = undefined
  emit('update:modelValue', null)
}

const removeImage = (idx) => {
  showImgList.value.splice(idx, 1)
  let files = []
  files = showImgList.value.map(item => {
    return item[config.returnType]
  })
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