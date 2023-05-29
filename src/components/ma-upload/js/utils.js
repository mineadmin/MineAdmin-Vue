import commonApi from '@/api/common'
import tool from '@/utils/tool'
import file2md5 from 'file2md5'

export const getFileUrl = async (returnType, value, storageMode) => {
  if (returnType === 'url') {
    return value
  } else if (returnType === 'id') {
    const { data } = await commonApi.getFileInfoById(value)
    if (data) {
      data.url = tool.attachUrl(data.url, storageMode[data.storage_mode])
      return data
    }
    return ''
  } else if (returnType === 'hash') {
    const { data } = await commonApi.getFileInfoByHash(value)
    if (data) {
      data.url = tool.attachUrl(data.url, storageMode[data.storage_mode])
      return data
    }
    return ''
  }
}

export const uploadRequest = async (file, type, method, requestData = {}) => {
  const hash = await file2md5(file)
  const dataForm = new FormData()
  dataForm.append(type, file)
  dataForm.append('isChunk', false)
  dataForm.append('hash', hash)
  for (let name in requestData) {
    dataForm.append(name, requestData[name])
  }
  const response = await commonApi[method](dataForm)
  return response.data
}
