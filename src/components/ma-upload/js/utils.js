import commonApi from '@/api/common'
import tool from '@/utils/tool'
import file2md5 from 'file2md5'

export const getFileUrl = async (returnType, value, storageMode) => {
  if (returnType == 'url') {
    return value
  } else if (returnType == 'id') {
    const res = await commonApi.getFileInfoById(value)
    if (res.data) {
      return tool.attachUrl(res.data.url, storageMode[res.data.storage_mode])
    }
    return ''
  } else if (returnType == 'hash') {
    const res = await commonApi.getFileInfoByHash(value)
    if (res.data) {
      return tool.attachUrl(res.data.url, storageMode[res.data.storage_mode])
    }
    return ''
  }
}

export const uploadRequest = async (file, type, method) => {
  const hash = await file2md5(file)
  const dataForm = new FormData()
  dataForm.append(type, file)
  dataForm.append('isChunk', false)
  dataForm.append('hash', hash)
  const response = await commonApi[method](dataForm)
  return response.data
}