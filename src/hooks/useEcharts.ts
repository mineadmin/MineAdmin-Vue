import useMineEcharts from '@mineadmin/echarts'
import type { MaEChartOptions, MaEchartsExpose } from '@mineadmin/echarts'
import { useColorMode } from '@vueuse/core'
import type { Ref } from 'vue'

const colorMode = useColorMode()

function themeMode() {
  return colorMode.value === 'dark' ? 'mineDark' : 'default'
}

function useEcharts(
  el: Ref<HTMLElement | null | undefined>,
  options?: MaEChartOptions,
): MaEchartsExpose {
  const instance = useMineEcharts(el as Ref<HTMLElement>, options)

  if (instance === null) {
    throw new Error('ECharts provider is not installed.')
  }

  return instance
}

export {
  themeMode,
  useEcharts,
}
