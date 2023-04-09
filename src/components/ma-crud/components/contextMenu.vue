<template>
  <ul
    class="ma-crud-contextmenu shadow-lg"
    v-if="crudContextMenuVisible"
    :style="{ left: left + 'px', top: top + 'px' }"
  >
    <template v-for="item in (options?.contextMenu?.items ?? [])">
      <li v-if="item.operation === 'divider'"><a-divider margin="8px" /></li>
      <li v-else @click="execCommand(item)">
        <div class="context-menu-item">
          <component v-if="defaultOperation.includes(item.operation)" :is="getIcon(item)" />
          <component v-else-if="item.icon" :is="getIcon(item)" />
          <span class="ml-2">{{ getText(item) }}</span>
        </div>
      </li>
    </template>
  </ul>
</template>

<script setup>
import { ref, inject, watch } from 'vue'
const left = ref(0)
const top = ref(0)
const crudContextMenuVisible = ref(false)
const currentRow = ref()
const emit = defineEmits([ 'execCommand' ])

const options = inject('options')

const defaultOperation = [
  'refresh', 'edit', 'delete', 'plus', 'nextPage', 'prevPage'
]

watch(
    () => crudContextMenuVisible.value,
    value => {

      const crudContextMenuhandler = (e) => {
        const dom = document.querySelector('.ma-crud-contextmenu')
        if (dom && !dom.contains(e.target)) {
          closeCrudcontextMenu()
        }
      }

      value
          ? document.body.addEventListener("click", e => crudContextMenuhandler(e))
          : document.body.removeEventListener("click", e => crudContextMenuhandler(e))
    }
)

const openContextMenu = (ev, record) => {
  left.value = ev.clientX
  top.value = ev.clientY
  currentRow.value = record
  crudContextMenuVisible.value = true
}

const closeCrudcontextMenu = () => {
  currentRow.value = null
  crudContextMenuVisible.value = false
}

const getIcon = (item) => {
  if (defaultOperation.includes(item.operation)) {
    item.icon = item.operation
    return `icon-${item.operation}`
  } else {
    return item.icon
  }
}

const getText = (item) => {
  if (defaultOperation.includes(item.operation)) {
    switch (item.operation) {
      case 'plus': return item.text ?? '新增数据'
      case 'refresh': return item.text ?? '刷新表格'
      case 'edit': return item.text ?? '编辑此行数据'
      // case 'delete': return item.text ?? '删除此行数据'
    }
  } else {
    return item.text
  }
}

const execCommand = (item) => {
  emit('execCommand', { contextItem: item, record: currentRow.value })
  crudContextMenuVisible.value = false
}

defineExpose({
  openContextMenu, closeCrudcontextMenu
})
</script>

<style scoped lang="less">
.ma-crud-contextmenu {
  position: fixed;
  min-width: 200px;
  z-index: 999;
  background: var(--color-bg-2);
  border: 1px solid var(--color-border-2);
  padding: 7px 0;
  border-radius: 4px;
  li .context-menu-item {
    cursor: pointer;
    padding: 5px 10px;
  }
  li:hover {
    background-color: var(--color-primary-light-1);
  }
}
</style>