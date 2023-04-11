<template>
  <ul
    class="ma-crud-contextmenu shadow-lg"
    v-show="crudContextMenuVisible"
    :style="{ left: left + 'px', top: top + 'px', height: 'auto' }"
  >
    <template v-for="item in (options?.contextMenu?.items ?? [])">
      <li v-if="item.operation === 'divider'"><a-divider margin="8px" /></li>
      <li v-if="item.operation === 'print'">
        <div class="context-menu-item" @click="execCommand(item)">
          <icon-printer /> <span class="ml-2">{{ item.text ?? '打印表格' }}</span>
        </div>
      </li>
      <li v-if="item.operation === 'refresh'">
        <div class="context-menu-item" @click="execCommand(item)">
          <icon-refresh /> <span class="ml-2">{{ item.text ?? '刷新表格' }}</span>
        </div>
      </li>
      <li v-if="item.operation === 'add' && showVerify('add')">
        <div class="context-menu-item" @click="execCommand(item)">
          <icon-plus /> <span class="ml-2">{{ item.text ?? '新增数据' }}</span>
        </div>
      </li>
      <li v-if="item.operation === 'edit' && showVerify('edit')">
        <div class="context-menu-item" @click="execCommand(item)">
          <icon-edit /> <span class="ml-2">{{ item.text ?? '编辑数据' }}</span>
        </div>
      </li>
      <li v-if="item.operation === 'delete' && showVerify('delete')">
        <a-popconfirm content="确实要删除此数据吗?" @ok="execCommand(item)">
          <div class="context-menu-item">
            <icon-delete /> <span class="ml-2">{{ item.text ?? '删除数据' }}</span>
          </div>
        </a-popconfirm>
      </li>
      <li v-if="! defaultOperation.includes(item.operation)">
        <div class="context-menu-item" @click="execCommand(item)">
          <component v-if="item.icon" :is="getIcon(item)" />
          <span class="ml-2">{{ getText(item) }}</span>
        </div>
      </li>
    </template>
  </ul>
</template>

<script setup>
import { ref, inject, watch, nextTick } from 'vue'
import checkAuth from '@/directives/auth/auth'
import { isArray } from "lodash"

const left = ref(0)
const top = ref(0)
const crudContextMenuVisible = ref(false)
const currentRow = ref()
const emit = defineEmits([ 'execCommand' ])

const options = inject('options')
const isRecovery = inject('isRecovery')

const defaultOperation = [
  'refresh', 'print', 'edit', 'divider', 'delete', 'add', 'nextPage', 'prevPage'
]

const showVerify = (type) => {
  if (! options[type].show) {
    return false
  }

  if (isRecovery.value === true) {
    return false
  }

  const authList = options[type].auth
  if (isArray(authList)) {
    for (let index in authList) {
      if (! checkAuth(authList[index])) {
        return false
      }
    }
  }
  return true
}

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

const openContextMenu = async (ev, record) => {
  crudContextMenuVisible.value = true
  currentRow.value = record
  await nextTick(() => {
    const domHeight = document.querySelector('.ma-crud-contextmenu').offsetHeight
    if (document.body.offsetHeight - ev.pageY < domHeight) {
      top.value = ev.clientY - domHeight
    } else {
      top.value = ev.clientY
    }
    left.value = ev.clientX
  })
}

const closeCrudcontextMenu = () => {
  currentRow.value = null
  crudContextMenuVisible.value = false
}

const getIcon = (item) => {
  if (! defaultOperation.includes(item.operation)) {
    return item.icon
  }
}

const getText = (item) => {
  if (! defaultOperation.includes(item.operation)) {
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