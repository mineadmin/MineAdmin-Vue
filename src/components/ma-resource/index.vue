<template>
  <div class="w-full h-full p-2 resource-container flex justify-between rounded-sm">
    <div class="flex flex-col w-1/5">
      <a-input
        class="mb-2"
        placeholder="搜索资源分类"
        @input="changeKeyword"
        allow-clear
      />
      <a-tree
        blockNode
        :data="treeData"
        class="shadow h-full w-full"
      >
        <template #icon><icon-folder /></template>
      </a-tree>
    </div>

    <div class="w-4/5 ml-2">
      asdasd
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, nextTick } from 'vue'
  import commonApi from '@/api/common'
import { isEmptyObject } from '@intlify/shared';

  const treeData = ref([])
  const originTreeData = ref([])
  const searchKey = ref('');

  onMounted(async () => {
    const attachment_type = await commonApi.getDict('attachment_type')
    originTreeData.value = attachment_type.data
    treeData.value = Object.assign(originTreeData.value, [])
  })

  const changeKeyword = (keyword) => {
    console.log(typeof keyword)
    if (! keyword || isEmptyObject(keyword)) {
      treeData.value = Object.assign(originTreeData.value, [])
    }
    treeData.value = searchNode(keyword)
  }

  const searchNode = (keyword) => {
    const loop = (data) => {
      let tree = []
      data.map(item => {
        console.log(item)
        if (item.children && item.children.length > 0) {
          tree = loop(item.children)
        } else if (item.title.indexOf(keyword) !== -1) {
          tree.push(item)
        }
        return tree
      })
    }
    return loop(originTreeData.value)
  }

  

</script>

<style scoped lang="scss">
.resource-container {
  background-color: var(--color-bg-4);
}
:deep(.arco-tree-node-indent),
:deep(.arco-tree-node-switcher)
{
  display: none;
}
:deep(.arco-tree-node-title) {
  padding-left: 15px; margin-left: -2px;
}
</style>
