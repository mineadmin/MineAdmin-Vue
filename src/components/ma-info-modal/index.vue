<template>
  <a-modal
      :width="prop.width"
      :fullscreen="isFull"
      v-model:visible="modal.visible"
      :on-before-ok="modal.submit"
      :unmount-on-close="true"
      @cancel="modal.cancel"
  >
    <template #title>
      {{ prop.title }}
    </template>
    <slot></slot>
    <slot name="body"></slot>
    <a-card
        class="mt-2"
        :hoverable="true"
        v-for="info in layout"
    >
      <ma-info
          v-if="isArray(info?.child)"
          :title="info.title"
          :columns="info.child"
          :data="infoData"
          ref="maInfoRefs"
      ></ma-info>
      <a-descriptions
       :title="info.title"
       v-else
      >
        <component
            :data="infoData"
            :is="info?.component"
        />
      </a-descriptions>

    </a-card>
    <ma-form
        v-model="form"
        ref="maFormRef"
        v-if="prop.formColumns.length > 0"
        :columns="prop.formColumns"
        :options="{showButtons: false, ...prop.formOptions}"
    />
  </a-modal>
</template>

<script setup>
import MaInfo from "../ma-info/index.vue";
import {getCurrentInstance, reactive, ref, watch} from "vue";
import {isArray, isFunction, isObject, isString} from "lodash";
import {isComponent} from "@arco-design/web-vue/es/_utils/vue-utils";
import {setModalSizeEvent} from "@/utils/common";
const emit = defineEmits(["visible", "validateError", "open", "cancel", "close"]);
const app = getCurrentInstance().appContext.app
const maFormRef = ref()
const prop = defineProps({
  width: {type: Number, default: 1200}, // modal框大小
  isFull: { type: Boolean, default: false},
  title: { type: String, default: "" }, // 弹出框标题
  column: { type: Array, default: [] }, // ma-form字段
  default_visible: { type: Boolean, default: false}, // 默认隐藏
  options: { type: Object, default: {} }, // ma-form 属性
  submit: { type: Function, default: () => {} },
  layout: { type: Object, default:[]},
  formOptions: {type: Object, default: {}}, // ma-form-options
  formColumns: { type: Array, default: []}
});
const isFull = ref(prop.isFull)
setModalSizeEvent((config) => {
  isFull.value = config.isFull
})

const maInfoRefs = ref([])
const layout = ref([])
const infoData = ref({})
const form = ref({})

watch(() => prop.layout, val => {
  layout.value = val
},{
  immediate: true,
})

let columnMap = {}
const init = async () => {
  let column = prop.column
  column.forEach(item => {
    columnMap[item.dataIndex] = item
  })
  if (layout.value.length > 0) {
    layout.value.forEach((item) => {
      if (item.component) {
        app.component(item.component, item.child)
        return;
      }
      item.child.forEach((child, index) => {
        if (isString(child)) {
          item.child[index] = columnMap[child]
        }
      })
    })
  }else{
    layout.value.push({
      title: "",
      child: column,
    })
  }
}

const modal = reactive({
  visible: prop.default_visible,
  open(data, formData = {}) {
    modal.visible = true;
    for (let [key, value] of Object.entries(data)) {
      infoData.value[key] = value;
    }
    for (let [key, value] of Object.entries(formData)) {
      form.value[key] = value;
    }
    emit("open", infoData);
  },
  close() {
    modal.visible = false;
  },
  async submit() {
    let validate = await maFormRef.value.validateForm()
    if (validate) {
      emit("validateError", validate)
      return false
    }
    return prop.submit(form._rawValue)
  },
  cancel() {
    emit("cancel");
  },
});

init()

defineExpose({
  open: modal.open,
  close: modal.close,
  data: infoData,
});
</script>

<style scoped>

</style>