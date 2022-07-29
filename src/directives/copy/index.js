import useClipboard from 'vue-clipboard3'
import { Message } from '@arco-design/web-vue'

const copy = (el, binding) => {
  const { value } = binding
  el.addEventListener('click', async () => {
    if (value && value !== '') {
      try {
        await useClipboard().toClipboard(value)
        Message.success('已成功复制到剪切板')
      } catch(e) {
        Message.error('复制失败')
      }
    } else {
      throw new Error(`need for copy content! Like v-copy="Hello World"`)
    }
  })
}

export default {
  mounted(el, binding) {
    copy(el, binding)
  },
  updated(el, binding) {
    copy(el, binding)
  },
};
