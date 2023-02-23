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
  <div class="w-full p-2 resource-container h-full lg:flex lg:justify-between rounded-sm">
    <a-modal v-model:visible="openNetworkModal" :ok-text="$t('sys.save')" :on-before-ok="saveNetworkImg" draggable>
      <template #title>{{ $t('maResource.saveNetworkImage') }}</template>
      <a-input v-model="networkImg" class="mb-3" :placeholder="$t('maResource.networkImageNotice')" allow-clear />
      <a-image :src="networkImg" width="100%" style="min-height: 150px;" />
    </a-modal>
    <div class="lg:w-1/5 w-full p-2 shadow">
      <ma-tree-slider
        v-model="sliderData"
        :search-placeholder="$t('maResource.searchResource')"
        :field-names="{ title: 'title', key: 'key' }"
        @click="handlerClick"
        icon="icon-folder"
        :selected-keys="['all']"
      />
    </div>
    <div class="w-full lg:ml-3 mt-3 lg:mt-2 flex flex-col">
      
      <div class="lg:flex lg:justify-between">
        <div class="flex">
          <ma-upload v-model="uploadFile" multiple :show-list="false" type="chunk" :resource="false" />
          <a-button class="ml-3" @click="openNetworkModal = true">
            <icon-image /> {{ $t('maResource.saveNetworkImage') }}
          </a-button>
        </div>
        <a-input
          v-model="filename"
          class="input-search lg:mt-0 mt-2"
          :placeholder="$t('maResource.searchFileNotice')"
          @press-enter="searchFile"
        />
      </div>
      <a-spin :loading="resourceLoading" :tip="$t('maResource.loadingText')" class="h-full">
        <div class="resource-list mt-2" ref="rl" v-if="attachmentList && attachmentList.length > 0">
          <div
            class="item rounded-sm"
            v-for="(item, index) in attachmentList"
            :key="item.hash"
            @click="selectFile(item, index)"
          >
            <img
              :src="
                ! /^(http|https)/g.test(item.url)
                ? $tool.attachUrl(item.url, getStoreMode(item.storage_mode))
                : item.url
              "
              v-if="item.mime_type.indexOf('image') !== -1"
            />
            <div v-else class="text-3xl w-full h-full flex items-center justify-center">
              {{`.${item.suffix}`}}
            </div>
            <a-tooltip position="bottom">
              <div class="file-name">
                {{ item.origin_name }}
              </div>
              <template #content>
                <div>存储名称：{{ item.object_name }}</div>
                <div>存储目录：{{ item.storage_path }}</div>
                <div>上传时间：{{ item.created_at }}</div>
                <div>文件大小：{{ item.size_info }}</div>
                <div>存储模式：{{ getStoreMode(item.storage_mode) }}</div>
              </template>
            </a-tooltip>
          </div>
        </div>
        <a-empty v-else class="mt-10" />
      </a-spin>
      <div class="lg:flex lg:justify-between">
        <a-pagination
          :total="pageInfo.total"
          v-model:current="pageInfo.currentPage"
          v-model:page-size="pageSize"
          @change="changePage"
        />
        <a-button type="primary" @click="selectComplete" class="mt-3 lg:mt-0">{{ $t('maResource.ok') }}</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import MaUpload from '@cps/ma-upload/index.vue'
  import uploadConfig from '@/config/upload'
  import MaTreeSlider from '@cps/ma-treeSlider/index.vue'
  import commonApi from '@/api/common'
  import attachmentApi from '@/api/system/attachment'
  import tool from '@/utils/tool'
  import { useI18n } from 'vue-i18n'
  import { Message } from '@arco-design/web-vue'

  const { t } = useI18n()
  const sliderData = ref([])
  const uploadFile = ref()
  const attachmentList = ref([])
  const openNetworkModal = ref(false)
  const networkImg = ref()
  const pageInfo = ref({
    total: 1,
    currentPage: 1
  })
  const resourceLoading = ref(true)
  const pageSize = ref(30)
  const filename = ref()
  const selecteds = ref()
  const rl = ref()

  const emit = defineEmits([ 'update:modelValue' ])

  const props = defineProps({
    modelValue: { type: [ String, Array ] },
    multiple: { type: Boolean, default: true },
    onlyData: { type: Boolean, default: true },
    returnType: { type: String, default: 'url'},
  })
  
  onMounted(async () => {
    const treeData = await commonApi.getDict('attachment_type')
    treeData.data.unshift({ title: '所有', key: 'all' })
    sliderData.value = treeData.data
    await getAttachmentList({pageSize: 1})

    if (props.multiple) {
      selecteds.value = []
    }
  })

  const getStoreMode = (mode) => {
    return uploadConfig.storageMode[mode.toString()]
  }

  const getAttachmentList = async (params = {}) => {
    const requestParams = Object.assign(params, { pageSize: pageSize.value })
    resourceLoading.value = true
    const response = await attachmentApi.getPageList(requestParams)
    pageInfo.value = response?.data?.pageInfo
    attachmentList.value = response?.data?.items
    resourceLoading.value = false
  }

  const handlerItemClick = (e) => {
    console.log(e)
  }

  const handlerClick = async (item) => {
    const type = item[0] === 'all' ? undefined : item[0]
    await getAttachmentList({ mime_type: type })
  }

  const searchFile = async () => {
    await getAttachmentList({ origin_name: filename.value })
  }

  const selectFile = (item, index) => {

    if ( ! props.multiple && selecteds.value ) {
      if (props.onlyData && item.url != selecteds.value) return
      if (! props.onlyData && item.id != selecteds.value.id) return
    }

    const children = rl.value.children
    const className = 'item rounded-sm'
    if (! /^(http|https)/g.test(item.url)) {
      item.url = tool.attachUrl(item.url, getStoreMode(item.storage_mode))
    }
    if (children[index].className.indexOf('active') !== -1) {
      children[index].className = className
      if (props.multiple) {
        selecteds.value.map((file, idx) => {
          if (props.onlyData && file == item.url) selecteds.value.splice(idx, 1)
          if (! props.onlyData && file.id == item.id) selecteds.value.splice(idx, 1)
        })
      } else {
        selecteds.value = ''
      }
    } else {
      children[index].className = className + ' active'
      if (props.multiple) {
        selecteds.value.push(props.onlyData ? item[props.returnType] : item)
      } else {
        selecteds.value = props.onlyData ? item[props.returnType] : item
      }
    }
  }

  const clearSelecteds = () => {
    if (rl.value && rl.value.children) {
      const children = rl.value.children
      for (let i = 0; i < children.length; i++) {
        children[i].className = 'item rounded-sm'
      }
    }
    if (props.multiple) {
      selecteds.value = []
    } else {
      selecteds.value = undefined
    }
  }

  const selectComplete = () => {
    const files = props.multiple ? Object.assign([], selecteds.value) : selecteds.value
    emit('update:modelValue', files)
  }

  const changePage = async (page) => {
    await getAttachmentList({ page })
  }

  const saveNetworkImg = async(done) => {
    if (! networkImg.value) {
      Message.error(t('maResource.networkImageNotice'))
      done(false)
      return
    }
    const response = await commonApi.saveNetWorkImage({ url: networkImg.value })
    if (response.success) {
      Message.success(response.message)
      await getAttachmentList()
      networkImg.value = undefined
      done(true)
    } else {
      Message.error(response.message)
      done(false)
    }
  }

  watch(
    () => uploadFile,
    async () => await getAttachmentList(),
    { deep: true }
  )

  defineExpose({ clearSelecteds })
</script>

<style scoped lang="less">
.input-search {
  width: 252px;
}
.resource-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
  .item {
    width: 130px; height: 130px; border: 2px solid var(--color-fill-1);
    margin-right: 10px; margin-bottom: 20px;
    background-color: var(--color-fill-1); 
    cursor: pointer; position: relative;
    .file-name {
      position: absolute; bottom: 0px; height: 23px;
      width: 100%; background: rgba(100, 100, 100, 0.3); line-height: 23px;
      font-size: 12px; overflow: hidden; padding: 0 10px;
      text-align: center; text-overflow: ellipsis;
      color: #fff;
    }
    img {
      width: 100%; height: 100%; object-fit: contain;
    }
  }
  .item:hover {
    border: 2px solid rgb(var(--primary-6));
  }
  .item.active {
    border: 2px solid rgb(var(--primary-6));
  }
  .item.active::after {
    content: ''; position: absolute;
    width: 126px; height: 126px; z-index: 2;
    top: 0;
    background: rgba(var(--primary-5), 0.2);
  }

}
</style>
