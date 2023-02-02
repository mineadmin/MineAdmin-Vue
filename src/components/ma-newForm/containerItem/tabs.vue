<template>
  <a-tabs :default-active-key="0">
    <a-tab-pane
      v-for="(tab, index) in props?.tabs ?? []"
      :key="index"
      :title="tab.title ?? `Tab ${index + 1}`"
    >
      Content of Tab Panel {{ index }}
    </a-tab-pane>
  </a-tabs>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  component: Object,
})

</script>