<template>
  <a-space direction="vertical" size="large" fill>
    <a-descriptions
      :data="descriptions"
      :column="props.column"
      :title="props.title"
      :layout="props.layout"
      :bordered="props.bordered"
      table-layout="fixed"
      :size="props.size"
      :label-style="props.labelStyle"
      :value-style="props.valueStyle"
    >
      <a-descriptions-item v-for="item in descriptions" :label="item.label">
        <template v-if="item.formType === 'upload'">
          <a-image-preview-group infinite v-if="isArray(item.value)">
            <a-space>
              <a-image v-for="src in item.value" :src="tool.viewImage(src)" width="50" />
            </a-space>
          </a-image-preview-group>
          <a-image v-else :src="tool.viewImage(item.value)" width="50"></a-image>
        </template>
        <template v-else-if="item.infoSlot">
          <slot :name="item.dataIndex" :row="item" :data="data"></slot>
        </template>
        <template v-else-if="item.formType === 'radio'">
          <a-tag color="blue">{{
            item.dict.data.filter((row) => row.value == item.value)[0]?.label
          }}</a-tag>
        </template>
        <div v-else>
          {{ item.value }}
        </div>
      </a-descriptions-item>
    </a-descriptions>
  </a-space>
</template>

<script setup>
/**
 * 描述列表 Descriptions https://arco.design/vue/component/descriptions
 * @author NekGod
 */
import { getCurrentInstance, ref, watch } from "vue";
import tool from "@/utils/tool";
import { get, isArray } from "lodash";

const app = getCurrentInstance().appContext.app;
const columns = ref([]);
const data = ref({});
const descriptions = ref([]);
const props = defineProps({
  columns: { type: Array },
  data: {},
  column: {
    default: 3,
  },
  title: {
    default: "",
  },
  bordered: {
    default: true,
  },
  layout: {
    default: "horizontal",
  },
  labelStyle: {
    default: {},
  },
  valueStyle: {
    default: {},
  },
  size: {
    default: "mini",
  },
});

watch(
  () => props.columns,
  (vl) => {
    columns.value = vl;
  },
  { deep: true, immediate: true }
);

watch(
  () => props.data,
  (vl) => {
    data.value = props.data;
    descriptions.value = [];
    columns.value.forEach((item) => {
      if (item.dataIndex === "__operation" || item.infoShow === false) {
        return;
      }
      descriptions.value.push({
        ...item,
        label: item.title,
        value: get(data.value, item.dataIndex),
      });
    });
  },
  { deep: true, immediate: true }
);
</script>

<style scoped></style>
