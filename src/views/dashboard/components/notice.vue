<template>
  <a-table class="w-full" :columns="columns" :data="currencyRateData" stripe :pagination="true"/>
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
  title: '系统公告',
  children: [{
    title: '标题',
    dataIndex: 'title',
    }, {
    title: '发布人',
    dataIndex: 'rate',
    sortable: { sortDirections: ['ascend', 'descend'] },
    width: 120
    }, {
    title: '发布时间',
    dataIndex: 'createTime',
    sortable: { sortDirections: ['ascend', 'descend'] },
    width: 180
  }]
}])
</script>