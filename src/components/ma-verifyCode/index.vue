<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<script setup>
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const codeText = ref('')
const verfiyCanvas = ref(null)
const props = defineProps({
  height: { type: Number, default: 36 },
  width: { type: Number, default: 120 },
  pool: { type: String, default: 'abcdefghjkmnpqrstuvwxyz23456789' },
  size: { type: Number, default: 4 },
  showError: { type: Boolean, default: true },
})

const checkResult = (verifyCode) => {
  if (! verifyCode || verifyCode.length === 0) {
    props.showError && Message.error(t('sys.verifyCode.notice'))
    return false
  }

  if (verifyCode.toLowerCase() !== codeText.value.toLowerCase()) {
    props.showError && Message.error(t('sys.verifyCode.error'))
    generateCode()
    return false
  } else {
    return true
  }
}

const randomNum = (min, max) => {
  return parseInt(Math.random() * (max - min) + min)
}

const randomColor = (min, max) => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r},${g},${b})`
}

const generateCode = () => {
  codeText.value = ''
  const ctx = verfiyCanvas.value.getContext('2d')
  ctx.fillStyle = randomColor(230, 255)
  ctx.fillRect(0, 0, props.width, props.height)

  for (let i = 0; i < props.size; i++) {
    let currentText = '' + props.pool[randomNum(0, props.pool.length)]
    codeText.value += currentText
    ctx.font = '36px Simhei'
    ctx.textAlign="center"
    ctx.fillStyle = randomColor(80, 150)
    ctx.fillText(currentText, (i + 1) * randomNum(20, 25), props.height / 2 + 13)
  }

  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(randomNum(0, props.width), randomNum(0, props.height))
    ctx.lineTo(randomNum(0, props.width), randomNum(0, props.height))
    ctx.strokeStyle = randomColor(180, 230)
    ctx.closePath()
    ctx.stroke()
  }

  for (let i = 0; i < 40; i++) {
    ctx.beginPath()
    ctx.arc(randomNum(0, props.width), randomNum(0, props.height), 1, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = randomColor(150, 200)
    ctx.fill()
  }

  ctx.restore()
  ctx.save()

  return codeText
}

onMounted(() => {
  generateCode()
})

const refresh = () => {
  generateCode()
}

defineExpose({ checkResult, refresh })
</script>

<template>
  <a-tooltip :content="t('sys.verifyCode.switch')">
    <canvas
      ref="verfiyCanvas"
      class="canvas"
      :width="props.width"
      :height="props.height" @click="refresh"
    />
  </a-tooltip>
</template>

<style scoped lang="less">
:deep(.arco-input-append){
  padding: 0 !important;
}
.canvas {
  cursor: pointer;
}
</style>