<template>
  <div class="sys-search-container">
    <div class="ssc-bg">
      <div class="w-6/12 mx-auto center-box">
        <div class="mt-10"><img :src="`${$url}logo.svg`" width="100" class="mx-auto"/></div>
        <div class="mt-10">
          <a-input
            size="large"
            ref="searchInputRef"
            placeholder="搜索页面，支持名称、标识以及URL的模糊查询"
            @input="searchPage"
          >
            <template #prefix><icon-search /></template>
          </a-input>
        </div>
        <div class="mt-5">
          <a-space size="large" class="flex justify-center">
            <a-space><a-tag>ALT+S</a-tag><a-tag>唤醒搜索面板</a-tag></a-space>
            <a-space><a-tag><icon-caret-up /></a-tag><a-tag><icon-caret-down /></a-tag><a-tag>切换搜索结果</a-tag></a-space>
            <a-space><a-tag>Enter</a-tag><a-tag>进入页面</a-tag></a-space>
            <a-space><a-tag>Esc</a-tag><a-tag>关闭搜索面板</a-tag></a-space>
          </a-space>
        </div>

        <ul class="mt-10 results shadow-lg customer-scrollbar">
          <template v-for="res in resultList">
            <li
              class="flex items-center"
              v-if="res && res.path.indexOf(':') === -1 && res.components && res?.meta?.type === 'M'"
              @click="gotoPage(res)"
            >
              <div class="icon-box flex justify-center items-center">
                <component v-if="res.meta.icon" :is="res.meta.icon" :class="res.meta.icon.indexOf('ma') > 0 ? 'icon' : ''" />
                <icon-menu v-else />
              </div>
              <div class="ml-5 leading-6">
                <div class="title">{{ res.meta.title }}</div>
                <div class="path">{{ res.path}}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick} from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from "@/store"

const appStore = useAppStore()
const router = useRouter()
const searchInputRef = ref()
const resultList = ref(router.getRoutes())

const searchPage = (value) => {
  resultList.value = router.getRoutes().filter(item => {
    if (item.path && item.path.indexOf(value) > -1) {
      return true
    }
    if (item.name && item.name.indexOf(value) > -1) {
      return true
    }
    if (item.meta && item.meta.title && item.meta.title.indexOf(value) > -1) {
      return true
    }
    return false
  })
}

const gotoPage = (res) => {
  appStore.searchOpen = false
  router.push(res.path)
}

onMounted(() => {
  searchInputRef.value.focus()
  document.addEventListener('keydown', e => {
    const keyCode = e.keyCode ?? e.which ?? e.charCode
    const active = document.querySelector('.active-search-li')

    const getActiveItemInfo = () => {
      const li = document.querySelectorAll('.results li')
      let activeItem = { idx: 0, path: '/' }
      li.forEach((item, index) => {
        if (item.className.split(' ').includes('active-search-li')){
          activeItem.path = item.querySelector('.path').innerHTML
          activeItem.idx = index
          return
        }
      })
      return activeItem
    }

    const add = (index) => {
        document.querySelectorAll('.results li')[index].classList.add('active-search-li')
    }
    const remove = (index) => {
        document.querySelectorAll('.results li')[index].classList.remove('active-search-li')
    }

    if (appStore.searchOpen) {
      // down
      if (keyCode === 40) {
        if (!active) {
          add(0)
          return
        } else {
          const li = document.querySelectorAll('.results li')
          let item = getActiveItemInfo(), nextIndex = item.idx + 1
          if (nextIndex >= li.length) {
            nextIndex = 0
          }
          remove(item.idx)
          add(nextIndex)
        }
      }

      // up
      if (keyCode === 38) {
        if (!active) {
          add(document.querySelectorAll('.results li').length - 1)
          return
        } else {
          const li = document.querySelectorAll('.results li')
          let item = getActiveItemInfo(), prevIndex = item.idx - 1
          if (prevIndex < 0) {
            prevIndex = li.length - 1
          }
          remove(item.idx)
          add(prevIndex)
        }
      }

      if (keyCode === 13) {
        const item = getActiveItemInfo()
        remove(item.idx)
        item.path !== '/' && gotoPage(item)
      }
    }

    nextTick(() => {
      const dom = document.querySelector('.results')
      if (dom && dom.scrollTop !== false) {
          dom.scrollTop = (getActiveItemInfo()['idx'] + 1) * 80 - (document.querySelectorAll('.results li').length * 10)
      }
    })
  })
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

  & .center-box {
    height: 90%;
  }

  & .results {
    background-color: var(--color-bg-2); border-radius: 6px;
    height: calc(100% - 250px); overflow-y: auto;

    & li {
      border-bottom: 1px solid var(--color-border-1);
      cursor: pointer;
      .title {
        font-size: 16px;
      }
      .path {
        color: var(--color-text-3);
      }
    }
    li:hover, .active-search-li {
      background-color: var(--color-neutral-1);
      .arco-icon, .icon {
        transition: all 0.25s;
        width: 1.8em !important; height: 1.8em !important;
      }
      .arco-icon {
        color: rgb(var(--primary-6));
      }
      .icon {
        fill: rgb(var(--primary-6));
      }
      .title {
        color: rgb(var(--primary-6));
      }
      .path {
        color: rgb(var(--primary-3));
      }
    }

    .icon-box {
      width: 80px; height: 80px; border-right: 1px solid var(--color-border-1);
    }
  }

  .arco-icon, .icon {
    width: 1.5em !important; height: 1.5em !important;
  }
  .arco-menu-selected .icon {
    fill: rgb(var(--primary-6));
  }
}
</style>