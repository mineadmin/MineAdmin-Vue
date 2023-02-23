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
  <a-cascader
    v-if="props.type === 'cascader'"
    path-mode
    v-model="val"
    placeholder="请选择省市区"
    :options="jsonData"
    :field-names="props.mode == 'name' ? { value: 'name', label: 'name' } : { value: 'code', label: 'name' }"
    check-strictly
    allow-search
    expand-trigger="hover"
  />
  <a-space v-else>
    <a-select
      v-model="selectData.province"
      :options="province"
      :field-names="props.mode == 'name' ? { value: 'name', label: 'name' } : { value: 'code', label: 'name' }"
      allow-search
      allow-clear
      @clear="() => { 
        selectData.city = ''
        selectData.area = ''
      }"
      placeholder="请选择省/直辖市/自治区"
      :style="{width:'220px'}"
      @change="provinceChange"
    />
    <a-select v-model="selectData.city"
      :options="city"
      :field-names="props.mode == 'name' ? { value: 'name', label: 'name' } : { value: 'code', label: 'name' }"
      allow-search
      allow-clear
      @clear="() => selectData.area = ''"
      placeholder="请选择地级市/市辖区"
      :style="{width:'220px'}"
      @change="cityChange"
    />
    <a-select v-model="selectData.area"
      :options="area"
      :field-names="props.mode == 'name' ? { value: 'name', label: 'name' } : { value: 'code', label: 'name' }"
      allow-search
      allow-clear
      :style="{width:'220px'}"
      placeholder="请选择区县"
    />
  </a-space>
</template>

<script setup>
import jsonData from './lib/city.json'
import { ref, watch } from 'vue'
import { isObject } from 'lodash'

const val = ref()
const selectData = ref({ province: '', city: '', area: '' })
const province = ref([])
const city = ref([])
const area = ref([])

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: [ Number, String, Object ],
  type: { type: String, default: 'select'},
  mode: { type: String, default: 'name' },
})

if (props.type === 'select') {
  province.value = jsonData.map(item => {
    return { code: item.code, name: item.name }
  })
}

const provinceChange = (val) => {
  jsonData.map(item => {
    if ( props.mode == 'name' && val == item.name) {
      city.value = item.children
    }
    if ( props.mode == 'code' && val == item.code) {
      city.value = item.children
    }
  })
}

const cityChange = (val) => {
  city.value.map(item => {
    if ( props.mode == 'name' && val == item.name) {
      area.value = item.children
    }
    if ( props.mode == 'code' && val == item.code) {
      area.value = item.children
    }
  })
}

const setSelectData = () => {
  if (props.type === 'select') {
    if (val.value && isObject(val.value)) {
      selectData.value.province = val.value.province ? val.value.province : ''
      selectData.value.city = val.value.city ? val.value.city : ''
      selectData.value.area = val.value.area ? val.value.area : ''
      selectData.value.province && provinceChange(selectData.value.province)
      selectData.value.city && selectData.value.province && cityChange(selectData.value.city)
    }
  }
}

val.value = props.modelValue

watch(
  () => props.modelValue,
  vl => () => {
    val.value = vl
    setSelectData()
  }, { deep: true }
)

watch(
  () => val.value,
  vl => emit('update:modelValue', vl)
)

watch(
  () => selectData.value,
  vl => emit('update:modelValue', vl),
  { deep: true }
)

setSelectData()
</script>
