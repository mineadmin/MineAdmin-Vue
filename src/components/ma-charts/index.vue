<template>
  <v-charts
    v-if="renderChart"
    :option="options"
    :autoresize="autoresize"
    :style="{ width, height }"
  />
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import VCharts from 'vue-echarts'
import { useAppStore } from '@/store'

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
  autoresize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})

const appStore = useAppStore()

const theme = computed(() => {
  return (appStore.theme === 'dark') ? 'dark' : ''
})

const renderChart = ref(false)

nextTick(() => {
  renderChart.value = true
})

</script>

<style scoped lang="scss"></style>
