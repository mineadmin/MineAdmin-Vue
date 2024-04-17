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
    v-model="val"
    :field-names="
      props.mode == 'name'
        ? { value: 'name', label: 'name' }
        : { value: 'code', label: 'name' }
    "
    :options="jsonData"
    allow-search
    check-strictly
    expand-trigger="hover"
    path-mode
    placeholder="请选择省市区"
  />
  <a-space v-else>
    <a-select
      v-model="selectData.province"
      :field-names="
        props.mode == 'name'
          ? { value: 'name', label: 'name' }
          : { value: 'code', label: 'name' }
      "
      :options="province"
      :style="{ width: '220px' }"
      allow-clear
      allow-search
      placeholder="请选择省/直辖市/自治区"
      @change="provinceChange"
      @clear="
        () => {
          selectData.city = [];
          selectData.area = [];
          selectData.province = [];
          selectData.city = [];
          selectData.area = [];
          province.value = [];
        }
      "
    />
    <a-select
      v-model="selectData.city"
      :field-names="
        props.mode == 'name'
          ? { value: 'name', label: 'name' }
          : { value: 'code', label: 'name' }
      "
      :options="city"
      :style="{ width: '220px' }"
      allow-clear
      allow-search
      placeholder="请选择地级市/市辖区"
      @change="cityChange"
      @clear="
        () => {
          selectData.city = [];
          selectData.area = [];
          selectData.city = [];
          selectData.area = [];
        }
      "
    />
    <a-select
      v-model="selectData.area"
      :field-names="
        props.mode == 'name'
          ? { value: 'name', label: 'name' }
          : { value: 'code', label: 'name' }
      "
      :options="area"
      :style="{ width: '220px' }"
      allow-clear
      allow-search
      placeholder="请选择区县"
      @clear="
        () => {
          selectData.area = [];
          selectData.area = [];
        }
      "
    />
  </a-space>
</template>

<script setup>
import jsonData from "./lib/city.json";
import { ref, watch } from "vue";
import { isObject } from "lodash";

const val = ref();
const selectData = ref({ province: [], city: [], area: [] });
const province = ref([]);
const city = ref([]);
const area = ref([]);

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: [Number, String, Object],
  type: { type: String, default: "select" },
  mode: { type: String, default: "name" },
});

if (props.type === "select") {
  province.value = jsonData.map((item) => {
    return { code: item.code, name: item.name };
  });
}

const provinceChange = (val, clear = true) => {
  if (clear) {
    selectData.value.city = [];
    selectData.value.area = [];
    area.value = [];
    city.value = [];
  }
  jsonData.map((item) => {
    if (props.mode == "name" && val == item.name) {
      city.value = item.children;
    }
    if (props.mode == "code" && val == item.code) {
      city.value = item.children;
    }
  });
};

const cityChange = (val, clear = true) => {
  if (clear) {
    selectData.value.area = [];
    area.value = [];
  }
  city.value.map((item) => {
    if (props.mode == "name" && val == item.name) {
      area.value = item.children;
    }
    if (props.mode == "code" && val == item.code) {
      area.value = item.children;
    }
  });
};

const setSelectData = () => {
  if (props.type === "select") {
    if (val.value && isObject(val.value)) {
      selectData.value.province = val.value.province ? val.value.province : "";
      selectData.value.city = val.value.city ? val.value.city : "";
      selectData.value.area = val.value.area ? val.value.area : "";
      selectData.value.province && provinceChange(selectData.value.province, false);
      selectData.value.city &&
        selectData.value.province &&
        cityChange(selectData.value.city, false);
    }
  }
};

val.value = props.modelValue;

watch(
  () => props.modelValue,
  (vl) => {
    val.value = vl;
    setSelectData();
  },
  { deep: true }
);

watch(
  () => val.value,
  (vl) => emit("update:modelValue", vl)
);

watch(
  () => selectData.value,
  (vl) => emit("update:modelValue", vl),
  { deep: true }
);

setSelectData();
</script>
