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
  <div class="ma-content-block lg:flex justify-between p-4">
    <div class="lg:w-2/12 w-full h-full p-2 shadow">
      <ma-tree-slider
        v-model="sliderData"
        :search-placeholder="$t('maResource.searchResource')"
        :field-names="{ title: 'title', key: 'key' }"
        @click="handlerClick"
        icon="icon-folder"
        :selected-keys="['all']"
      />
    </div>

    <div class="lg:w-10/12 w-full lg:ml-4 mt-5 lg:mt-0">
      <!-- CRUD 组件 -->
      <ma-crud :crud="crud" :columns="columns" ref="crudRef">
        <template #tools>
          <a-tooltip :content="mode === 'list' ? '切换橱窗模式' : '切换列表模式' ">
            <a-button shape="circle" @click="switchMode"><icon-apps v-if="mode === 'list'" /><icon-list v-else /></a-button>
          </a-tooltip>
        </template>
        <template #content="tableData">
          <ul v-if="mode === 'window'">

          </ul>
        </template>

        <template #operationBeforeExtend="{ record }">
          <a-link><icon-download /> 下载</a-link>
        </template>
      </ma-crud>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive, computed } from 'vue'
  import attachment from '@/api/system/attachment'
  import user from '@/api/system/user'
  import commonApi from '@/api/common'
  import { useI18n } from 'vue-i18n'
  import { Message, Modal } from '@arco-design/web-vue'

  const { t } = useI18n()
  const crudRef = ref()
  const mode = ref('list')
  const sliderData = ref([])
  const selecteds = ref([])

  onMounted(async () => {
    const treeData = await commonApi.getDict('attachment_type')
    treeData.data.unshift({ title: '所有', key: 'all' })
    sliderData.value = treeData.data
    // await getAttachmentList({pageSize: 1})
  })

  const handlerClick = (value) => console.log(value)

  const switchMode = () => {
    mode.value = mode.value === 'list' ? 'window' : 'list'
  }

  const crud = reactive({
    api: attachment.getPageList,
    recycleApi: attachment.getRecyclePageList,
    showIndex: false,
    searchLabelWidth: '75px',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 200,
    delete: {
      show: true,
      api: attachment.deletes, auth: ['system:attachment:delete'],
      realApi: attachment.realDeletes, realAuth: ['system:attachment:realDeletes']
    },
    recovery: { show: true, api: attachment.recoverys, auth: ['system:attachment:recovery']},
    isDbClickEdit: false
  })

  const columns = reactive([
    { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
    { 
      title: '存储名称', dataIndex: 'object_name', width: 200,
    },
    { 
      title: '原文件名', dataIndex: 'origin_name', width: 150, search: true,
    },
    {
      title: '存储模式', dataIndex: 'storage_mode', width: 100, search: true, formType: 'select',
      dict: { name: 'upload_mode', props: { label: 'title', value: 'key' }, translation: true },
    },
    { 
      title: '资源类型', dataIndex: 'mime_type', width: 130,
    },
    { 
      title: '存储目录', dataIndex: 'storage_path', width: 130,
    },
    { 
      title: '文件大小', dataIndex: 'size_info', width: 130,
    },
    {
      title: '上传时间', dataIndex: 'created_at', width: 180,
      search: true, formType: 'range'
    },
  ])
</script>

<script>
export default { name: 'system:attachment' }
</script>

<style scoped>

</style>