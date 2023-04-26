<template>
  <div class="sys-search-container">
    <div class="ssc-bg">
      <div class="w-5/12 mx-auto">
        <div class="mt-10"><img :src="`${$url}logo.svg`" width="100" class="mx-auto"/></div>
        <div class="mt-10">
          <a-input size="large" ref="searchInputRef" placeholder="请输入要搜索的菜单名称或标识">
            <template #prefix><icon-search /></template>
          </a-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const searchInputRef = ref()

onMounted(() => {
  searchInputRef.value.focus()
})
</script>

<style scoped lang="less">
.sys-search-container {
  top: 0; left: 0; position: absolute; z-index: 999;
  width: 100%; height: 100%; overflow: hidden;

  & .ssc-bg {
    position: absolute; z-index: 999; width: 100%; height: 100%;
    top:0; left: 0;
    background-color: rgba(100, 100, 100, 0.2);
    backdrop-filter: blur(12px);
  }
}
</style>