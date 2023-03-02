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
      <ma-crud :options="crud" :columns="columns" ref="crudRef">
        <!-- 表格按钮后置扩展 -->
        <template #tableAfterButtons>
          <a-input-group v-if="mode === 'window'">
            <a-button @click="selectAll"><template #icon><icon-select-all /></template>全选</a-button>
            <a-button @click="flushAll"><template #icon><icon-eraser /></template>清除</a-button>
          </a-input-group>
        </template>
        <!-- 工具按钮扩展 -->
        <template #tools>
          <a-tooltip :content="mode === 'list' ? '切换橱窗模式' : '切换列表模式' ">
            <a-button shape="circle" @click="switchMode"><icon-apps v-if="mode === 'list'" /><icon-list v-else /></a-button>
          </a-tooltip>
        </template>
        <!-- 自定义内容 -->
        <template #content="tableData">
          <a-checkbox-group v-if="mode === 'window'" v-model="selecteds" @change="handlerChange">
            <a-image-preview-group infinite>
              <a-space class="window-list ">
                <template v-for="record in tableData" :key="record.id">
                  <div class="mb-2 image-content">
                    <a-checkbox :value="record.id" class="checkbox">
                      <template #checkbox="{ checked }">
                        <a-tag :checked="checked" color="blue" checkable><icon-check /> 选择</a-tag>
                      </template>
                    </a-checkbox>
                    <a-image
                      width="190"
                      height="190"
                      show-loader
                      :title="record.object_name"
                      :description="`大小：${record.size_info}`"
                      :src="
                        /image/g.test(record.mime_type) ?
                        tool.attachUrl(record.url, getStoreMode(record.storage_mode))
                        : '/not-image.png'
                      "
                    >
                      <template #extra>
                        <div class="actions">
                          <a-tooltip content="下载此文件">
                            <span class="action" @click="download(record)"><icon-download /></span>
                          </a-tooltip>
                          <a-tooltip>
                            <span class="action"><icon-info-circle /></span>
                            <template #content>
                              <div>存储名称：{{ record.object_name }}</div>
                              <div>存储目录：{{ record.storage_path }}</div>
                              <div>上传时间：{{ record.created_at }}</div>
                              <div>存储模式：{{ getStoreMode(record.storage_mode) }}</div>
                            </template>
                          </a-tooltip>
                        </div>
                      </template>
                    </a-image>
                  </div>
                </template>
              </a-space>
            </a-image-preview-group>
          </a-checkbox-group>
        </template>

        <!-- 预览内容自定义 -->
        <template #url="{ record }">
          <a-image
            class="list-image"
            v-if="/image/g.test(record.mime_type)"
            width="40px"
            height="40px"
            :src="tool.attachUrl(record.url, getStoreMode(record.storage_mode))"
          />
          <a-avatar v-else shape="square" style="top: 0px;">{{ record.suffix }}</a-avatar>
        </template>

        <!-- 操作列前置扩展 -->
        <template #operationBeforeExtend="{ record }">
          <a-link @click="download(record)"><icon-download /> 下载</a-link>
        </template>
      </ma-crud>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, reactive, computed, nextTick } from 'vue'
  import uploadConfig from '@/config/upload'
  import MaTreeSlider from '@cps/ma-treeSlider/index.vue'
  import attachment from '@/api/system/attachment'
  import commonApi from '@/api/common'
  import { useI18n } from 'vue-i18n'
  import { Message, Modal } from '@arco-design/web-vue'
  import tool from '@/utils/tool'

  const { t } = useI18n()
  const crudRef = ref()
  const mode = ref('list')
  const sliderData = ref([])
  const selecteds = ref([])

  onMounted(async () => {
    const treeData = await commonApi.getDict('attachment_type')
    treeData.data.unshift({ title: '所有', key: 'all' })
    sliderData.value = treeData.data
  })

  const handlerClick = async (value) => {
    const type = value[0] === 'all' ? undefined : value[0]
    crudRef.value.requestParams.mime_type = type
    crudRef.value.refresh()
  }

  const switchMode = () => {
    mode.value = mode.value === 'list' ? 'window' : 'list'
  }

  const download = async (record) => {
    let url = ''
    let storeMode = getStoreMode(record.storage_mode)

    if (storeMode !== 'LOCAL') {
      Message.info('处理中...')
      const domain = upload.storage[storeMode]
      url = domain + record.url
    } else {
      //文件上传在本地则请求后端下载
      Message.info('请求服务器下载文件中...')
      url = 'system/downloadById?id=' + record.id
    }

    const response = await commonApi.download(url, 'get')
    if (response) {
      tool.download(response, (storeMode !== 'LOCAL') ? record.origin_name : '')
      Message.success('请求成功，文件开始下载')  
    } else {
      Message.error('文件下载失败')  
    }
  }

  const handlerChange = (val) => {
    selecteds.value = val
    crudRef.value.setSelecteds(val)
  }

  const selectAll = () => {
    crudRef.value.getTableData().map( item => selecteds.value.push(item.id) )
    crudRef.value.setSelecteds(selecteds.value)
  }

  const flushAll = () => {
    selecteds.value = []
    crudRef.value.setSelecteds([])
  }

  const getStoreMode = (mode) => {
    return uploadConfig.storageMode[mode.toString()]
  }

  const crud = reactive({
    api: attachment.getPageList,
    recycleApi: attachment.getRecyclePageList,
    searchColNumber: 3,
    requestParams: {},
    showIndex: false,
    pageLayout: 'fixed',
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 200,
    delete: {
      show: true,
      api: attachment.deletes, auth: ['system:attachment:delete'],
      realApi: attachment.realDeletes, realAuth: ['system:attachment:realDeletes']
    },
    recovery: { show: true, api: attachment.recoverys, auth: ['system:attachment:recovery']},
    isDbClickEdit: false,
  })

  const columns = reactive([
    // { title: 'ID', dataIndex: 'id', addDisplay: false, editDisplay: false, width: 50 },
    { 
      title: '预览', dataIndex: 'url', width: 80,
    },
    { 
      title: '存储名称', dataIndex: 'object_name', width: 220,
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
/* :deep(.arco-image) {
  border-radius: var(--border-radius-medium);
}
:deep(.arco-image-with-footer-inner .arco-image-footer) {
  border-bottom-right-radius: var(--border-radius-medium);
  border-bottom-left-radius: var(--border-radius-medium);
} */
:deep(.arco-image-img) {
  object-fit: contain;
  background-color: var(--color-fill-4);
}
:deep(.arco-image-with-footer-inner .arco-image-footer) {
  padding: 9px;
}
:deep(.arco-image-footer-caption-title) {
  font-size: 14px;
}
:deep(.arco-image-footer-extra) {
  position: relative;
}
:deep(.arco-avatar-square) {
  top: -6px;
}
.window-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
}
.image-content {
  position: relative
}
.image-content .checkbox {
  position: absolute; z-index: 10;
  right: -16px; color: #fff;
}
:deep(.arco-tag-checkable) {
  color: #fff;
  background: rgba(0,0,0,.5);
}
/* :deep(.arco-tag-checkable:hover) {
  color: #555;
} */
.actions {
  display: flex;
  align-items: center;
  position:absolute;
  right: 9px; bottom: -24px;
}
.action {
  padding: 5px 4px;
  font-size: 14px;
  margin-left: 6px;
  border-radius: 2px;
  line-height: 1;
  cursor: pointer;
}
.action:first-child {
  margin-left: 0;
}

.action:hover {
  background: rgba(0,0,0,.5);
}
</style>