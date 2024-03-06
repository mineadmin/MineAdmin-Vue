<template>
  <!-- 组件外部的 form-item -->
    <div style="z-index: 100;border: 1px solid #ccc;width: 100%">
      <Toolbar
          style="border-bottom: 1px solid #ccc;"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          :style="{ height: props.height + 'px', overflowY: 'hidden' }"
          v-model="content"
          :defaultConfig="editorConfig"
          :mode="props.mode"
          @onCreated="handleCreated"
      />

      <a-modal style="z-index: 1000" v-model:visible="resourceVisible" :render-to-body="false" :width="1080" :footer="false"  draggable>
        <template #title>资源选择器</template>
        <ma-resource v-model="list" multiple ref="resource" returnType="url" />
      </a-modal>
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import MaResource from '@cps/ma-resource/index.vue'
import {onBeforeUnmount, ref, shallowRef, watch, computed} from 'vue'
import { Boot } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {useAppStore} from "@/store"
import {uploadRequest} from "@cps/ma-upload/js/utils";
import tool from "@/utils/tool";
import uploadConfig from "@/config/upload";

const resourceVisible = ref(false)
const appStore = useAppStore()

const props = defineProps({
  modelValue: { type: String },
  component: Object,
  height: { type: Number, default: 300 },
  mode:{type: String, default:'default' },
  customField: { type: String, default: undefined }
})

const emit = defineEmits(['update:modelValue', 'change'])

let registerWangEditorButtonFlag = appStore.appCurrentSetting.registerWangEditorButtonFlag

const list = ref([])
const resource = ref()

let content = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
});

watch(
    () => content.value,
    vl => emit('change', vl)
)

watch(
    () => list.value,
    imgs => {
      let tmp = ''
      imgs.map(img => {

        if (img.indexOf('.jpg') > -1 || img.indexOf('.png') > -1 || img.indexOf('.bmp') > -1 || img.indexOf('.jpeg') > -1 || img.indexOf('.svg') > -1 || img.indexOf('.gif') > -1) {
          const node = {"type":"image","src":img,"href":"","alt":"","style":{},"children":[{"text":""}]}
          editorRef.value.insertNode(node)
        }
      })

      resource.value.clearSelecteds()
      resourceVisible.value = false
    }
)

const editorRef = shallowRef()

const toolbarConfig = {}
toolbarConfig.excludeKeys = [
  'group-video',
  'insertImage',
]

class MyButtonMenu {
  constructor() {
    this.title = '资源选择器'
    this.tag = 'button'
  }

  //  获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor) {
    return ''
  }

  //  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor) {
    return false
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor) {
    return false
  }

  // 点击菜单时触发的函数
  exec(editor, value) {
    editor.emit("click_menu");
  }
}

const menu1Conf = {
  key: 'menu1', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new MyButtonMenu()
  },
}

if (registerWangEditorButtonFlag === undefined || registerWangEditorButtonFlag === false){

  Boot.registerMenu(menu1Conf)

  appStore.setRegisterWangEditorButtonFlag(true);
}

toolbarConfig.insertKeys = {
  index: 1, // 插入的位置，基于当前的 toolbarKeys
  keys: ['menu1']
}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {},
  hoverbarKeys: {
    // 在编辑器中，选中链接文本时，要弹出的菜单
    link: {
      menuKeys: [ // 默认的配置可以通过 `editor.getConfig().hoverbarKeys.image` 获取
        'imageWidth30',
        'imageWidth50',
        'imageWidth100',
        '|',               // 分割符
        'imageFloatNone',  // 增加 '图片浮动' 菜单
        'imageFloatLeft',
        'imageFloatRight',
        '|',               // 分割符
        'editImage',
        'viewImageLink',
        'deleteImage',
      ],
    }
  }
}

editorConfig.MENU_CONF['uploadImage'] = {
  async customUpload(file, insertFn) {
    uploadRequest(file, 'image', 'uploadImage').then((res) => {
      insertFn(tool.attachUrl(res.url, uploadConfig.storageMode[res.storage_mode]));
    });
  }
}

const handleCreated = (editor) => {
  editorRef.value = editor

  editorRef.value.on("click_menu", ()=> {
    resourceVisible.value = true
  });
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

</script>

<style scoped>

</style>
