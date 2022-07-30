<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
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

let mode = computed(() => {
  return (appStore.mode === 'dark') ? 'dark' : 'auto'
})

const renderChart = ref(false)

nextTick(() => {
  renderChart.value = true
})

</script>

<style scoped lang="less"></style>
