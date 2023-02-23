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
  <a-modal v-model:visible="visible" :footer="false" @cancel="close" draggable>
    <template #title>导入</template>
    <a-upload draggable :custom-request="upload" :show-file-list="false" accept=".xlsx,.xls">
      <template #upload-button>
        <div
          style="background-color: var(--color-fill-2); border: 1px dashed var(--color-fill-4);"
          class="rounded text-center p-7"
        >
          <div>
            <icon-upload class="text-5xl text-gray-400" />
            <div class="text-red-600 font-bold">导入Excel</div>
            将文件拖到此处，或<span style="color: #3370FF">点击上传</span>，只能上传 xls/xlsx 文件
          </div>
        </div>
      </template>
    </a-upload>
    <div class="mt-5 italic text-right"><a-link @click="sendDownload">下载Excel模板</a-link></div>
  </a-modal>
</template>

<script setup>
import { ref, inject } from 'vue'
import commonApi from '@/api/common'
import tool from '@/utils/tool'
import { Message } from '@arco-design/web-vue'

const visible = ref(false)

const options = inject('options')

const open = () => visible.value = true
const close = () => visible.value = false

const upload = (fileOption) => {
  Message.info('文件上传导入中...')

  const dataForm = new FormData()
  dataForm.append('file', fileOption.fileItem.file)
  commonApi.importExcel(options.import.url, dataForm).then( res => {
    res.success && Message.success(res.message || '导入成功')
    close()
  })
}

const sendDownload = () => {
  Message.info('请求服务器下载文件中...')
  const url = options.import.templateUrl
  if ( /^(http|https)/g.test(url) ) {
    window.open(url)
  } else {
    commonApi.download(url).then(res => {
      tool.download(res)
      Message.success('请求成功，文件开始下载')  
    })
  }
}

defineExpose({ open, close })
</script>
