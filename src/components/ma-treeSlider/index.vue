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
  <div class="flex flex-col w-full h-full">
    <a-input-group class="mb-2 w-full" size="mini">
      <a-input
        :placeholder="props?.searchPlaceholder"
        allow-clear
        @input="changeKeyword"
        @clear="resetData"
      />
      <a-button
        @click="() => {
          isExpand ? maTree.expandAll(false) : maTree.expandAll(true)
          isExpand = ! isExpand
        }"
      >{{ isExpand ? '折叠' : '展开' }}</a-button>
    </a-input-group>
    <a-tree
      blockNode
      ref="maTree"
      :data="treeData"
      class="h-full w-full"
      @select="handlerSelect"
      :field-names="props.fieldNames"
      v-model:selected-keys="modelValue"
      v-bind="$attrs"
    >
      <template #icon v-if="props.icon"><component :is="props.icon" /></template>
    </a-tree>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'

  const treeData = ref([])
  const maTree = ref()
  const isExpand = ref(false)

  const emit = defineEmits(['update:modelValue', 'click'])

  const props = defineProps({
    modelValue: { type: Array },
    data: { type: Array },
    searchPlaceholder: { type: String },
    fieldNames: { type: Object, default: () => { return { title: 'label', key: 'value' } } },
    icon: { type: String, default: undefined },
  })

  const modelValue = computed({
    get() {
      return props.modelValue
    },
    set(newVal) {
      emit('update:modelValue', newVal)
    }
  })

  watch(
    () => props.data,
    val => {
      treeData.value = val
    },
    { immediate: true, deep: true }
  )

  const handlerSelect = (item, data) => {
    modelValue.value = [ item ]
    emit('click', ...[item, data])
  }

  const resetData = () => treeData.value = props.data

  const changeKeyword = (keyword) => {
    if (!keyword || keyword === '') {
      treeData.value = Object.assign(props.data, [])
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
        } else if (item[props.fieldNames['title']].indexOf(keyword) !== -1) {
          tree.push(item)
        }
        return tree
      })

      return tree
    }
    return loop(treeData.value)
  }

  defineExpose({ maTree })
</script>

<style scoped lang="less">
:deep(.arco-tree-node:hover) {
  background-color: var(--color-fill-2);
  border-radius: 3px;
}
:deep(.arco-tree-node-switcher) {
  margin-left: 2px;
}
</style>
