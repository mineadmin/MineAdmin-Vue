<template>
  <div class="flex justify-between tags-container" ref="containerDom" v-if="appStore.tag">
    <div class="menu-tags-wrapper" ref="scrollbarDom" :class="{ 'tag-pn': tagShowPrevNext }">
      <div class="tags" ref="tags">
        <a v-for="tag in tagStore.tags" :key="tag.path" @contextmenu.prevent="openContextMenu($event, tag)"
          :class="route.fullPath == tag.path ? 'active' : ''"
          @click="tagJump(tag)">
          {{ tag.customTitle ? tag.customTitle : appStore.i18n ? ($t('menus.' + tag.name).indexOf('.') > 0 ? tag.title : $t('menus.' + tag.name)) : tag.title }}
          <icon-close class="tag-icon" v-if="!tag.affix" @click.stop="closeTag(tag)" />
        </a>
      </div>
      <span class="ma-tag-prev" v-if="tagShowPrevNext">
        <IconLeft :size="20" class="tag-scroll-icon" @click="handleScroll(-500)" />
      </span>
      <span class="ma-tag-next" v-if="tagShowPrevNext">
        <IconRight :size="20" class="tag-scroll-icon" @click="handleScroll(500)" />
      </span>
    </div>
    <a-trigger class="ma-tags-more-dropdown" :popup-translate="[-65, -6]" :show-arrow="true" trigger="hover">
      <span class="ma-tags-more">
        <span class="ma-tags-more-icon">
          <i class="ma-box ma-box-t"></i>
          <i class="ma-box ma-box-b"></i>
        </span>
      </span>
      <template #content>
        <ul class="ma-tags-more-contextmenu">
          <li @click="tagToolRefreshTag">
            <icon-refresh />
            {{ $t('sys.tags.refresh') }}
          </li>
          <a-divider class="dropdown-divider" />
          <li @click="tagToolCloseCurrentTag">
            <icon-close-circle />
            {{ $t('sys.tags.closeTag') }}
          </li>
          <li @click="tagToolCloseOtherTag">
            <icon-close-circle-fill />
            {{ $t('sys.tags.closeOtherTag') }}
          </li>
        </ul>
      </template>
    </a-trigger>
    <ul class="tags-contextmenu" v-if="contextMenuVisible" :style="{ left: left + 'px', top: top + 'px' }">
      <li @click="contextMenuRefreshTag">
        <icon-refresh />
        {{ $t('sys.tags.refresh') }}
      </li>
      <a-divider />
      <li @click="contextMenuCloseTag" :class="contextMenuItem.affix ? 'disabled' : ''">
        <icon-close-circle />
        {{ $t('sys.tags.closeTag') }}
      </li>
      <li @click="contextMenuCloseOtherTag">
        <icon-close-circle-fill />
        {{ $t('sys.tags.closeOtherTag') }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useAppStore, useTagStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { addTag, closeTag, refreshTag } from '@/utils/common'
import Sortable from "sortablejs"
import { Message } from '@arco-design/web-vue'
import { IconFaceFrownFill } from '@arco-design/web-vue/dist/arco-vue-icon'
import tool from '@/utils/tool'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tagStore = useTagStore()
const tags = ref(null)
const tagShowPrevNext = ref(false)
const contextMenuVisible = ref(false)
const contextMenuItem = ref(null)
const left = ref(0)
const top = ref(0)
const notAddTagList = [ 'login' ]
watch(
  () => appStore.tag,
  r => {
    nextTick(() => {
      tagShowPrevNext.value = tags.value.scrollWidth > tags.value.offsetWidth
    })
  },
  { deep: true }
)
watch(
  () => tagStore.tags,
  r => {
    nextTick(() => {
      tagShowPrevNext.value = tags.value.scrollWidth > tags.value.offsetWidth
    })
  },
  { deep: true }
)
watch(
  () => route,
  r => {
    if (!notAddTagList.includes(r.name)) {
      addTag({
        name: r.name,
        path: r.fullPath,
        affix: r.meta.affix,
        title: r.meta.title
      })
    }

    nextTick(() => {
      if ( tags.value && tags.value.scrollWidth > tags.value.clientWidth ) {
        //确保当前标签在可视范围内
        tags.value.querySelector('.active').scrollIntoView()
      }
    })
  }, { deep: true }
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

const tagJump = tag => {
  router.push({ path: tag.path, query: tool.getRequestParams(tag.path) })
}

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
  if (route.fullPath != tag.fullPath) {
    router.push({ path: tag.path, query: tool.getRequestParams(tag.path) })
  }
  refreshTag()
}

const tagToolRefreshTag = () => {
  refreshTag()
}
const tagToolCloseCurrentTag = () => {
  const list = [...tagStore.tags]
  list.forEach(tag => {
    if (tag.affix || route.path == tag.path) {
      closeTag(tag)
    }
  })
}
const contextMenuCloseTag = () => {
  if (!contextMenuItem.value.affix) {
    closeTag(contextMenuItem.value)
    contextMenuVisible.value = false
  }
}
const tagToolCloseOtherTag = () => {
  const list = [...tagStore.tags]
  list.forEach(tag => {
    if (tag.affix || route.path == tag.path) {
      return true
    } else {
      closeTag(tag)
    }
  })
  contextMenuVisible.value = false
}
const contextMenuCloseOtherTag = () => {
  const currentTag = contextMenuItem.value
  if (route.path != currentTag.path) {
    router.push({ path: currentTag.path })
  }
  const list = [...tagStore.tags]
  list.forEach(tag => {
    if (tag.affix || currentTag.path == tag.path) {
      return true
    } else {
      closeTag(tag)
    }
  })
  contextMenuVisible.value = false
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
const handleScroll = (offset) => {
  const distance = tags.value.scrollLeft
  const total = distance + offset
  const step = offset / 50
  moveSlow(distance, total, step)
};
const moveSlow = (distance, total, step) => {

  if (step > 0) {
    //往左滚
    if (distance < total) {
      distance += step
      tags.value.scrollLeft = distance
      window.requestAnimationFrame(() => {
        moveSlow(distance, total, step)
      })
    } else {
      tags.value.scrollLeft = total;
    }
  } else {
    //往右滚
    if (distance > total) {
      distance += step
      tags.value.scrollLeft = distance
      window.requestAnimationFrame(() => {
        moveSlow(distance, total, step)
      })
    } else {
      tags.value.scrollLeft = total;
    }
  }
}
onMounted(() => {
  if (tags.value) {
    Sortable.create(tags.value, { draggable: 'a', animation: 300 })
    tags.value.addEventListener("mousewheel", scrollHandler, { passive: true }) ||
      tags.value.addEventListener("DOMMouseScroll", scrollHandler, { passive: true })
    nextTick(() => {
      tagShowPrevNext.value = tags.value.scrollWidth > tags.value.offsetWidth
    })
  }
})
</script>

<style scoped lang="less">
  .tag-pn {
    padding: 0 15px;
    margin: 0 5px;
  }

  .menu-tags-wrapper {

    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    display: inline-flex;

    .ma-tag-next,
    .ma-tag-prev {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      height: 34px;

      .tag-scroll-icon {
        cursor: pointer;
        color: var(--color-text-3);
        ;
      }

      .tag-scroll-icon:hover {
        color: rgb(var(--primary-6));
      }
    }

    .ma-tag-prev {
      left: -4px;
    }

    .ma-tag-next {
      right: -4px;
    }

    .tags a {
      margin-left: 4px;
      margin-right: 0;
    }
  }

  .ma-tags-more {
    position: relative;
    box-sizing: border-box;
    display: flex;
    text-align: left;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    margin-left: 5px;
    top: -1px;

    .ma-tags-more-icon {
      display: inline-block;
      color: var(--color-text-2);
      cursor: pointer;
      transition: transform .3s ease-out;

      .ma-box {
        position: relative;
        display: block;
        width: 14px;
        height: 8px;

        .ma-box-t:before {
          transition: transform .3s ease-out .3s;
        }
      }

      .ma-box:before {
        position: absolute;
        top: 2px;
        left: 0;
        width: 6px;
        height: 6px;
        content: "";
        background: var(--color-text-3);
      }

      .ma-box:after {
        position: absolute;
        top: 2px;
        left: 8px;
        width: 6px;
        height: 6px;
        content: "";
        background: var(--color-text-3);
      }
    }
  }

  .ma-tags-more:hover .ma-tags-more-icon .ma-box:before {
    background: rgb(var(--primary-6));
    transform: rotate(45deg);
  }

  .ma-tags-more:hover .ma-tags-more-icon .ma-box:after {
    background: rgb(var(--primary-6));
  }

  .ma-tags-more:hover .ma-tags-more-icon {
    transform: rotate(90deg);
  }

  .dropdown-divider {
    margin: 0;
  }

  .ma-tags-more-contextmenu {
    border: 1px solid var(--color-border-2);
    padding: 5px 0;
    z-index: 100;
    width: 170px;
    background-color: var(--color-bg-5);
    border-radius: 4px;

    li {
      padding: 7px 15px;
      color: var(--color-text-2);
      font-size: 13px;
    }

    li:hover {
      background-color: rgb(var(--primary-1));
      cursor: pointer;
    }

    .arco-divider-horizontal {
      margin: 5px 0;
    }
  }
</style>