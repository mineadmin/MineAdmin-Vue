<template>
  <Chart height="289px" :option="loginChartOptions" />
</template>

<script setup>
import { ref } from 'vue'
import { graphic } from 'echarts'
// import useChartOption from '@/utils/useChartOption'

function graphicFactory(side) {
  return {
    type: 'text',
    bottom: '8',
    ...side,
    style: {
      text: '',
      textAlign: 'center',
      fill: '#4E5969',
      fontSize: 12,
    },
  };
}

const xAxis = ref([
  '2022-05-06', '2022-05-07', '2022-05-08', '2022-05-09', '2022-05-10', '2022-05-11', '2022-05-12','2022-05-13','2022-05-14','2022-05-15'
])
const chartsData = ref([32, 56, 61, 89, 12, 33, 56, 92, 180, 25])
const graphicElements = ref([
  graphicFactory({ left: '2.6%' }),
  graphicFactory({ right: 0 }),
]);

const loginChartOptions = ref(
  {
    grid: {
      left: '2.6%',
      right: '0',
      top: '10',
      bottom: '30',
    },
    xAxis: {
      type: 'category',
      offset: 2,
      data: xAxis.value,
      boundaryGap: false,
      axisLabel: {
        color: '#4E5969',
        formatter(value, idx) {
          if (idx === 0) return '';
          if (idx === xAxis.value.length - 1) return '';
          return `${value}`;
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        interval: (idx) => {
          if (idx === 0) return false;
          if (idx === xAxis.value.length - 1) return false;
          return true;
        },
        lineStyle: {
          color: '#E5E8EF',
        },
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#23ADFF',
          width: 2,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisLabel: {
        formatter(value, idx) {
          if (idx === 0) return value;
          return `${value}k`;
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#E5E8EF',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        return `<div>
        <p class="tooltip-title">${params[0].axisValueLabel}</p>
        <div class="content-panel"><span>登录次数</span><span class="tooltip-value">${(
          Number(params[0].value)
        ).toLocaleString()}</span></div>
      </div>`;
      },
      className: 'echarts-tooltip-diy',
    },
    graphic: {
      elements: graphicElements.value,
    },
    series: [
      {
        data: chartsData.value,
        type: 'line',
        smooth: true,
        symbolSize: 12,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
          },
        },
        lineStyle: {
          width: 3,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(30, 231, 255, 1)',
            },
            {
              offset: 0.5,
              color: 'rgba(36, 154, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(111, 66, 251, 1)',
            },
          ]),
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(17, 126, 255, 0.16)',
            },
            {
              offset: 1,
              color: 'rgba(17, 128, 255, 0)',
            },
          ]),
        },
      },
    ],
  }
)
</script>