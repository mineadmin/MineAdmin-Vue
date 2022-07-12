<template>
  <div class="w-full h-full" v-show="$route.meta.type === 'I'">
    <iframe
      v-for="item in iframeStore.iframes"
      v-show="item == $route.name"
      :src="$route.meta.url"
      :key="item"
      frameborder="0"
      class="w-full h-full"
    />
  </div>
</template>

<script setup>
  import { watch, onMounted } from 'vue'
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

  onMounted(() => pushRoute(route))

  const pushRoute = (r) => {
    if (r.meta.type === 'I') {
      iframeStore.addIframe(route.name)
    }
  }
</script>