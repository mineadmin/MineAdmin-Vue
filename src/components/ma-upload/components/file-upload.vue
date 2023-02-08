<template>
  <div class="upload-file" v-if="props.type === 'file' && !props.chunk">
    <a-upload
      :custom-request="uploadFileHandler"
      :show-file-list="props.showList"
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
              将文件拖到此处，或<span style="color: #3370FF">点击上传</span>
            </div>
          </div>
        </slot>
      </template>
    </a-upload>
  </div>
</template>
<script setup>

</script>
<style lang="less" scoped>

</style>