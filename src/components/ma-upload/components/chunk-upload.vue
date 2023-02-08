<template>
  <div class="chunk" v-if="props.chunk">
    <a-upload
      :custom-request="chunkUpload"
      :show-file-list="false"
      :multiple="props.multiple"
      :accept="accept"
      :disabled="props.disabled"
      :tip="props.tip"
      :draggable="draggable"
      :limit="props.limit"
      :show-retry-button="false"
      :show-cancel-button="false"
      @before-remove="removeFile"
    >
      <template #upload-button v-if="props.fileType === 'drag'">
        <slot name="customer">
          <div
            style="background-color: var(--color-fill-2); border: 1px dashed var(--color-fill-4);"
            class="rounded text-center p-7 w-full"
          >
            <div>
              <icon-upload class="text-5xl text-gray-400" />
              <div class="text-red-600 font-bold">
                {{ props.title === 'buttonText' ? $t('upload.buttonText') : props.title }}
              </div>
              {{ $t('upload.uploadDesc') }}<span style="color: #3370FF">{{ $t('upload.clickUpload') }}</span>
            </div>
          </div>
        </slot>
      </template>
    </a-upload>
    <div class="chunk-upload-list mt-3" v-if="fileList && props.showList">
      <a-space direction="vertical" fill>
        <template v-if="props.multiple">
          <div
            class="chunk-file-list flex flex-col"
            v-for="item in fileList"
            :key="item.uid"
          >
            <div class="flex justify-between items-center">
              <div>{{ item.name }}</div>
              <a-button shape="circle" @click="removeChunkFile(item)">
                <template #icon><icon-delete /></template>
              </a-button>
            </div>
            <a-progress animation :percent="item.percent || 0" class="mt-2"/>
          </div>
        </template>
        <div
          v-else
          class="chunk-file-list flex flex-col"
        >
          <div class="flex justify-between items-center">
            <div>{{ fileList.file?.name ?? fileList }}</div>
            <a-button shape="circle" @click="removeChunkFile">
              <template #icon><icon-delete /></template>
            </a-button>
          </div>
          <a-progress animation :percent="(fileList.percent ? 0 : 1)" class="mt-2"/>
        </div>
      </a-space>
    </div>
  </div>
</template>
<script setup>

</script>
<style lang="less" scoped>

</style>