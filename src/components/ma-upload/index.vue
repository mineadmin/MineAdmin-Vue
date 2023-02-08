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
    <ma-image-upload v-if="props.type === 'image'" v-model="file" />
    <ma-file-upload v-if="props.type === 'file'" />
    <ma-chunk-upload v-if="props.type === 'chunk'" />
  </div>
</template>
<script setup>
import { ref, watch, nextTick, provide } from 'vue'
import commonApi from '@/api/common'
import { Message, } from '@arco-design/web-vue'

import { isArray, isObject, isString } from '@vue/shared'
import MaImageUpload from './components/image-upload.vue'
import MaFileUpload from './components/file-upload.vue'
import MaChunkUpload from './components/chunk-upload.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emit = defineEmits(['update:modelValue'])
const file = ref()
const props = defineProps({
  modelValue: { type: [ String, Array, Object, Number ], default: () => {} },
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
  onlyData: { type: Boolean, default: true },
  returnType: { type: String, default: 'url' },
  fileType: { type: String, default: 'button' },
  showList: { type: Boolean, default: true },
})

if (! ['id', 'url', 'hash'].includes(props.returnType)) {
  Message.error('MaUpload组件props的returnType只能为：id, url, hash 其中一个')
  console.error('MaUpload组件props的returnType只能为：id, url, hash 其中一个')
}

file.value = props.modelValue

const storageMode = {
  '1': 'LOCAL',
  '2': 'OSS',
  '3': 'COS',
  '4': 'QINIU'
}

provide('storageMode', storageMode)
provide('config', props)

const fileList = ref()
const accept = ref()
const draggable = ref(false)
const currentItem = ref(null)


const init = () => {
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

  if (props.type === 'image') {
    watch(
      () => props.modelValue,
      vl => {
        if (isArray(props.modelValue)) {
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
        } else if (isString(props.modelValue) || isObject(props.modelValue)) {
          fileList.value = props.modelValue
        }
      }
    )
  }
  watch(
    () => file.value,
    vl => emit('update:modelValue', vl)
  )
}

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
      fileList.value = props.onlyData ? result[props.returnType] : result
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
        files.push(props.onlyData ? item[props.returnType] : item)
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
        files.push(props.onlyData && item[props.returnType] ? item[props.returnType] : item)
      })
      emit('update:modelValue', files)
    } else {
      fileList.value = res
      emit('update:modelValue', props.onlyData && res[props.returnType] ? res[props.returnType] : res)
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
            item.percent === 1 && files.push(props.onlyData ? item.res[props.returnType] : item.res)
          })
          emit('update:modelValue', files)
        } else {
          fileList.value.percent = 1
          emit('update:modelValue', props.onlyData ? res.data[props.returnType] : res.data)
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
        files.push(props.onlyData ? item.res[props.returnType] : item.res)
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
        files.push(props.onlyData && item[props.returnType] ? item[props.returnType] : item)
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

init()
</script>