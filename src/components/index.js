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
import MaTreeSlider from './ma-treeSlider/index.vue'
import MaResource from './ma-resource/index.vue'
import MaResourceButton from './ma-resource/button.vue'
import MaUser from './ma-user/index.vue'
import MaEditor from './ma-editor/index.vue'
import MaIcon from './ma-icon/index.vue'

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
    Vue.component('MaTreeSlider', MaTreeSlider)
    Vue.component('MaResource', MaResource)
    Vue.component('MaResourceButton', MaResourceButton)
    Vue.component('MaUser', MaUser)
    Vue.component('MaEditor', MaEditor)
    Vue.component('MaIcon', MaIcon)
  }
}
