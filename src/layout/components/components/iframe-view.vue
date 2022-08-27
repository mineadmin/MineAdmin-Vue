<template>
  <div class="w-full h-full" v-show="$route.meta.type === 'I'">
    <iframe
      v-for="item in iframeStore.iframes"
      v-show="item.meta.url === $route.meta.url"
      :src="item.meta.url"
      :key="item.name"
      frameborder="0"
      class="w-full h-full"
    />
  </div>
</template>

<script setup>
  import { watch } from 'vue'
  import { useIframeStore } from '@/store'
  import { useRoute } from 'vue-router'

  const iframeStore = useIframeStore()
  const route = useRoute()


  watch(
    () => route,
    value => {
      pushRoute(value)
    },
    { deep: true }
  )

  const pushRoute = (r) => {
    if (r.meta.type === 'I') {
      iframeStore.addIframe(r)
    }
  }

  pushRoute(route)
</script>