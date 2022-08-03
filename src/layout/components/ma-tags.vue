<template>
  <div class="flex justify-between tags-container">
    <div class="tags" ref="tags" v-if="appStore.tag">
      <a
        v-for="tag in tagStore.tags" :key="tag.name"
        @contextmenu.prevent="openContextMenu($event, tag)"
        :class="route.name == tag.name ? 'active' : ''"
        @click="$router.push({ name: tag.name, query: tag.query || {} })"
      >
        {{ tag.customTitle ? tag.customTitle : $t('menus.' + tag.name).indexOf('.') > 0 ? tag.title : $t('menus.' + tag.name) }}
        <icon-close class="tag-icon" v-if="! tag.affix" @click.stop="closeTag(tag)" />
      </a>
    </div>
    <ul
      class="tags-contextmenu"
      v-if="contextMenuVisible"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li @click="contextMenuRefreshTag"><icon-refresh /> {{ $t('sys.tags.refresh') }}</li>
      <a-divider />
      <li
        @click="contextMenuCloseTag"
        :class="contextMenuItem.affix ? 'disabled' : ''"
      >
        <icon-close-circle /> {{ $t('sys.tags.closeTag') }}
      </li>
      <li @click="contextMenuCloseOtherTag"><icon-close-circle-fill /> {{ $t('sys.tags.closeOtherTag') }}</li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, nextTick } from 'vue'
  import { useAppStore, useTagStore, useKeepAliveStore } from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  import Sortable from "sortablejs"

  const route = useRoute()
  const router = useRouter()
  const appStore  = useAppStore()
  const tagStore  = useTagStore()
  const keepStore = useKeepAliveStore()
  const tags = ref(null)
  
  const contextMenuVisible = ref(false)
  const contextMenuItem = ref(null)
  const left = ref(0)
  const top = ref(0)
  const notAddTagList = [
    'login'
  ]

  watch(
    () => route,
    r  => {
      if (! notAddTagList.includes(r.name)) {
        addTag({
          name: r.name,
          path: r.path,
          affix: r.meta.affix,
          title: r.meta.title,
          query: r.query
        })

        if (tags.value && tags.value.scrollWidth > tags.value.clientWidth) {
          tags.value.querySelector('.active').scrollIntoView()
        }
      }
    },
    { deep: true }
  )

  watch(
    contextMenuVisible,
    value => {

      const handler = (e) => {
        const dom = document.querySelector('.tags-contextmenu')
        if (dom && !dom.contains(e.target)) {
          closeContextMenu()
        }
      }

      value
       ? document.body.addEventListener("click", e => handler(e))
       : document.body.removeEventListener("click", e => handler(e))
    }
  )

  const openContextMenu = (e, tag) => {
    contextMenuItem.value = tag
    contextMenuVisible.value = true
    left.value = e.clientX + 1
    top.value = e.clientY + 1

    nextTick(() => {
      const dom = document.querySelector('.tags-contextmenu')
      if (document.body.offsetWidth - e.clientX < dom.offsetWidth) {
        left.value = document.body.offsetWidth - dom.offsetWidth + 1;
        top.value = e.clientY + 1;
      }
    })
  }

  const closeContextMenu = () => {
    contextMenuItem.value = null
    contextMenuVisible.value = false
  }

  const contextMenuRefreshTag = () => {
    const tag = contextMenuItem.value
    contextMenuVisible.value = false
    if (route.name != tag.name) {
      router.push({ name: tag.name, query: tag.query || {} })
    }
    NProgress.start()
    keepStore.removeKeepAlive(tag.name)
    keepStore.hidden()
    nextTick(() => {
      keepStore.addKeepAlive(tag.name)
      keepStore.display()
      NProgress.done()
    })
  }

  const contextMenuCloseTag = () => {
    if (! contextMenuItem.value.affix) {
      closeTag(contextMenuItem.value)
      contextMenuVisible.value = false
    }
  }

  const contextMenuCloseOtherTag = () => {
    const currentTag = contextMenuItem.value
    if (route.name != currentTag.name) {
      router.push({ name: currentTag.name, query: currentTag.query || {} })
    }
    const list = [...tagStore.tags]
    list.forEach(tag => {
      if (tag.affix || currentTag.name == tag.name) {
        return true
      } else {
        closeTag(tag)
      }
    })
    contextMenuVisible.value = false
  }

  const addTag = async (tag) => {
    tagStore.addTag(tag)
    keepStore.addKeepAlive(tag.name)
  }

  const closeTag = async (tag) => {
    const t = await tagStore.removeTag(tag)
    keepStore.removeKeepAlive(tag.name)
    router.push({ name: t.name, query: t.query })
  }

  const scrollHandler = event => {
    const detail = event.wheelDelta || event.detail;
    const moveForwardStep = 1;
    const moveBackStep = -1;
    let step = 0;
    if (detail == 3 || (detail < 0 && detail != -3)) {
      step = moveForwardStep * 50;
    } else {
      step = moveBackStep * 50;
    }
    tags.value.scrollLeft += step;
  }
  
  onMounted(() => {
    if (tags.value) {
      Sortable.create(tags.value, { draggable: 'a', animation: 300 })
      tags.value.addEventListener("mousewheel", scrollHandler, { passive: true }) ||
      tags.value.addEventListener("DOMMouseScroll", scrollHandler, { passive: true })
    }
  })
</script>

<style scoped lang="less">
[mine-skin="mine"] {
  .tags a {
    margin-left: 4px; margin-right: 0;
  }
}
</style>