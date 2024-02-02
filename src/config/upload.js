export default {
  storage: {
    LOCAL: import.meta.env.VITE_APP_BASE_URL,
    OSS: '',
    QINIU: '',
    COS: '',
    FTP: '',
    MEMORY: '',
    S3: '',
    MINIO: ''
  },

  storageMode: {
    '1': 'LOCAL',
    '2': 'OSS',
    '3': 'QINIU',
    '4': 'COS',
    '5': 'FTP',
    '6': 'MEMORY',
    '7': 'S3',
    '8': 'MINIO'
  }
}