<template>
  <div>
    <editor v-model="content" :init="initConfig"></editor>

    <a-modal v-model:visible="resourceVisible" :width="910" :footer="false"  draggable>
      <template #title>资源选择器</template>
      <ma-resource v-model="list" multiple ref="resource" />
    </a-modal>
  </div>
</template>

<script setup>
  import { reactive, ref, watch } from 'vue'

  import Editor from '@tinymce/tinymce-vue'
  import tinymce from 'tinymce/tinymce'

  import 'tinymce/icons/default'
  import 'tinymce/models/dom'
  import 'tinymce/themes/silver'

  import 'tinymce/plugins/advlist'    //高级列表
  import 'tinymce/plugins/anchor'   //锚点
  import 'tinymce/plugins/autolink'   //自动链接
  import 'tinymce/plugins/autosave'   //自动存稿
  import 'tinymce/plugins/charmap'    //特殊字符
  import 'tinymce/plugins/code'   //编辑源码
  import 'tinymce/plugins/codesample'   //代码示例
  import 'tinymce/plugins/directionality'   //文字方向
  import 'tinymce/plugins/emoticons'    //表情
  import 'tinymce/plugins/fullscreen'   //全屏
  import 'tinymce/plugins/help'   //帮助
  import 'tinymce/plugins/image'    //插入编辑图片
  import 'tinymce/plugins/importcss'    //引入css
  import 'tinymce/plugins/insertdatetime'   //插入日期时间
  import 'tinymce/plugins/link'   //超链接
  import 'tinymce/plugins/lists'    //列表插件
  import 'tinymce/plugins/media'    //插入编辑媒体
  import 'tinymce/plugins/nonbreaking'    //插入不间断空格
  import 'tinymce/plugins/pagebreak'    //插入分页符
  import 'tinymce/plugins/preview'    //预览
  import 'tinymce/plugins/quickbars'    //快速工具栏
  import 'tinymce/plugins/save'   //保存
  import 'tinymce/plugins/searchreplace'    //查找替换
  import 'tinymce/plugins/table'    //表格
  import 'tinymce/plugins/template'   //内容模板
  import 'tinymce/plugins/visualblocks'   //显示元素范围
  import 'tinymce/plugins/visualchars'    //显示不可见字符
  import 'tinymce/plugins/wordcount'    //字数统计

  const props = defineProps({
    plugins: {
      type: [String, Array],
      default:
        "preview searchreplace autolink directionality visualblocks visualchars fullscreen link media template code codesample table charmap nonbreaking insertdatetime advlist lists wordcount autosave"
    },
    toolbar: {
      type: [String, Array],
      default:
        "code undo redo restoredraft | paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | fullscreen preview | alignleft aligncenter alignright alignjustify outdent indent formatpainter | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table media \
    charmap pagebreak insertdatetime | resource"
    }
  })

  const content = ref('')
  const list = ref([])
  const resource = ref()
  const resourceVisible = ref(false)

  const initConfig = reactive({
    menubar: false, // 菜单栏显隐
    language_url: '/tinymce/i18n/zh_CN.js',
    language: 'zh_CN',
    skin_url: '/tinymce/skins/ui/tinymce-5',
    height: 400,
    toolbar_mode: 'wrap',
    plugins: props.plugins,
    toolbar: props.toolbar,
    setup: (editor) => {
      editor.on('init', () => {
        editor.getBody().style.fontSize = '14px';
      })
      editor.ui.registry.addButton('resource', {
        text:'资源选择器',
        onAction: () => resourceVisible.value = true
      })
    }
  })

  watch(
    () => list.value,
    imgs => {
      imgs.map(img => content.value += `<img src=${img} width="100%" />`)
      list.value = []
      resource.value.clearSelecteds()
      resourceVisible.value = false
    }
  )
</script>
