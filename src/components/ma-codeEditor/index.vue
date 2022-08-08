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
  <div class="editor" ref="dom" :style="'width: 100%; height: ' + props.height + 'px'"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/store'
import { formatJson } from '@/utils/common'
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
    type: [String, Object, Array],
    default: () => ''
  },
  isBind: {
    type: Boolean,
    default: false
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
    value: (typeof props.modelValue === 'string') ? props.modelValue : formatJson(props.modelValue),
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

if (props.isBind) {
  watch(
    () => props.modelValue,
    vl => instance.setValue((typeof vl === 'string') ? vl : formatJson(vl))
  )
}

</script>

<style scoped lang="less">
.editor {
  border: 1px solid var(--color-border-2);
  border-radius: 3px;
  background: var(--color-bg-2);
}
</style>