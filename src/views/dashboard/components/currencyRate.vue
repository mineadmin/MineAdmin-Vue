<template>
  <a-table :columns="columns" :data="currencyRateData" stripe :pagination="true"/>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { list as currencyRateList } from '@/api/currencyRate.js'

onMounted(() => {
  // 获取汇率列表
  currencyRateList().then(res => {
    currencyRateData.value = res.data
  }).catch(e => {
    console.error(e)
  })
})

const currencyRateData = ref([])
const columns = reactive([{
  title: '当前主要货币汇率',
  children: [{
    title: '货币',
    dataIndex: 'currencyName',
    sortable: { sortDirections: ['ascend', 'descend'] },
    width: 120
  }, {
    title: '汇率',
    dataIndex: 'rate',
    sortable: { sortDirections: ['ascend', 'descend'] },
    width: 90
  }, {
    title: '更新时间',
    dataIndex: 'createTime',
    width: 180
  }]
}])
</script>