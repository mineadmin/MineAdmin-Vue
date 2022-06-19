<template>
  <div>
    <div class="tags w-full" v-if="appStore.tag">
      <a
        v-for="tag in tagStore.tags" :key="tag.name"
        @contextmenu.prevent="openContextMenu($event, tag)"
        :class="route.name == tag.name ? 'active' : ''"
        @click="$router.push({ name: tag.name })"
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

    </ul>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useAppStore, useTagStore } from '@/store'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const appStore  = useAppStore()
  const tagStore  = useTagStore()
  
  const contextMenuVisible = ref(false)
  const contextMenuItem = ref(null)
  const left = ref(0)
  const top = ref(0)

  watch(
    () => route,
    r  => {
      tagStore.addTag({
        name: r.name,
        path: r.path,
        affix: r.meta.affix,
        title: r.meta.title,
        query: r.query
      })
    },
    { deep: true }
  )

  const closeTag = async (tag) => {
    const t = await tagStore.removeTag(tag)
    router.push({ name: t.tag, query: t.query })
  }
</script>

<style scoped lang="scss">
[mine-skin="mine"] {
  .tags a {
    margin-left: 4px; margin-right: 0;
  }
}
</style>