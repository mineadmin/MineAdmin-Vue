import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from 'echarts/components'

import MaCrud from './ma-crud/index.vue'
import MaChart from './ma-charts/index.vue'
import MaUpload from './ma-upload/index.vue'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

export default {
  install(Vue) {
    Vue.component('MaChart', MaChart)
    Vue.component('MaCrud', MaCrud)
    Vue.component('MaUpload', MaUpload)
  }
}
