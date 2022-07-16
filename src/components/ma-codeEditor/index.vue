<template>
  <div class="editor" ref="dom" :style="'width: 100%; height: ' + props.height + 'px'"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/store'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/basic-languages/php/php.contribution'
import 'monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution'
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution'
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution'
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController'

const appStore = useAppStore()

const props = defineProps({
  modelValue: {
    type: String,
    default: () => {}
  },
  height: {
    type: Number,
    default: 400
  },
  language: {
    type: String,
    default: 'javascript'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const dom = ref()

let instance

onMounted(() => {
  instance = monaco.editor.create(dom.value, {
    model: monaco.editor.createModel(props.modelValue, props.language),
    tabSize: 2,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    language: props.language,
    theme: appStore.mode === 'light' ? 'vs' : 'vs-dark',
    autoIndent: true,
    minimap: { enabled: false },
    readOnly: props.readonly,
    folding: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: true,
    contextmenu: true
  })

  instance.onDidChangeModelContent(() => {
    emit('update:modelValue', instance.getValue())
  })
})
</script>

<style scoped lang="less">
.editor {
  border: 1px solid var(--color-border-2);
  border-radius: 3px;
  background: var(--color-bg-2);
}
</style>