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
  <div class="flex flex-col h-full">
    <a-input
      class="mb-2"
      :placeholder="props?.searchPlaceholder"
      allow-clear
      @input="changeKeyword"
      @clear="resetData"
    />
    <a-tree
      blockNode
      :data="treeData"
      class="shadow h-full w-full"
      @select="handlerSelect"
      v-model:selected-keys="selectedKeys"
    >
      <template #icon><icon-folder /></template>
    </a-tree>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'

  const treeData = ref([])
  const selectedKeys = ref([])

  const emit = defineEmits(['click'])

  const props = defineProps({
    modelValue: { type: Array },
    searchPlaceholder: { type: String },
    selectedKeys: { type: Array }
  })

  onMounted( () => selectedKeys.value = props.selectedKeys )

  watch(
    () => props.modelValue,
    val => treeData.value = val
  )

  const handlerSelect = (item, data) => {
    console.log(item)
    selectedKeys.value = [ item ]
    emit('click', ...[item, data])
  }

  const resetData = () => treeData.value = props.modelValue

  const changeKeyword = (keyword) => {
    if (!keyword || keyword === '') {
      treeData.value = Object.assign(props.modelValue, [])
      return false
    }
    treeData.value = searchNode(keyword)
  }

  const searchNode = (keyword) => {
    const loop = (data) => {
      let tree = []
      data.map(item => {
        if (item.children && item.children.length > 0) {
          const temp = loop(item.children)
          tree.push(...temp)
        } else if (item.title.indexOf(keyword) !== -1) {
          tree.push(item)
        }
        return tree
      })

      return tree
    }
    return loop(props.modelValue)
  }
</script>

<style scoped lang="less">
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
