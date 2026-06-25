<i18n lang="yaml">
zh_CN:
  terminalTitle: 插件终端
  status:
    pending: 等待执行
    running: 执行中
    success: 执行成功
    failed: 执行失败
    cancelled: 已取消
    expired: 已过期
    lost: 状态已丢失
  step: 步骤
  progress: 进度
  copy: 复制
  clear: 清空
  autoScroll: 自动滚动
  cancel: 取消执行
  close: 关闭
  empty: 等待后端输出...
  copied: 已复制
  cancelConfirm: 确认取消当前执行任务？
  terminalDone: 任务已结束
zh_TW:
  terminalTitle: 插件終端
  status:
    pending: 等待執行
    running: 執行中
    success: 執行成功
    failed: 執行失敗
    cancelled: 已取消
    expired: 已過期
    lost: 狀態已遺失
  step: 步驟
  progress: 進度
  copy: 複製
  clear: 清空
  autoScroll: 自動捲動
  cancel: 取消執行
  close: 關閉
  empty: 等待後端輸出...
  copied: 已複製
  cancelConfirm: 確認取消目前執行任務？
  terminalDone: 任務已結束
en:
  terminalTitle: Plugin Terminal
  status:
    pending: Pending
    running: Running
    success: Success
    failed: Failed
    cancelled: Cancelled
    expired: Expired
    lost: Lost
  step: Step
  progress: Progress
  copy: Copy
  clear: Clear
  autoScroll: Auto scroll
  cancel: Cancel
  close: Close
  empty: Waiting for backend output...
  copied: Copied
  cancelConfirm: Cancel the current task?
  terminalDone: Task finished
</i18n>

<script setup lang="ts">
import type { TerminalLogLine, TerminalStatus, TerminalTask } from '../api/terminal.ts'
import { cancelTerminalTask, getTerminalLogs, getTerminalTask } from '../api/terminal.ts'
import { ElMessage } from 'element-plus'
import { useMessage } from '@/hooks/useMessage.ts'

const props = withDefaults(defineProps<{
  modelValue: boolean
  taskNo?: string
  title?: string
}>(), {
  taskNo: '',
  title: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'finished', task: TerminalTask): void
}>()

const { localTrans: t } = useTrans()
const msg = useMessage()
const task = ref<TerminalTask>()
const logs = ref<TerminalLogLine[]>([])
const afterSeq = ref(0)
const autoScroll = ref(true)
const loading = ref(false)
const terminalRef = ref<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const terminalStatuses: TerminalStatus[] = ['success', 'failed', 'cancelled', 'expired', 'lost']
const isTerminal = computed(() => task.value ? terminalStatuses.includes(task.value.status) : false)
const progress = computed(() => Number(task.value?.progress ?? 0))
const displayTitle = computed(() => props.title || task.value?.title || t('terminalTitle'))
const allText = computed(() => logs.value.map(item => `[${item.time}] ${item.stream}> ${item.message}`).join('\n'))

watch(() => props.taskNo, (value) => {
  reset()
  if (value && visible.value) {
    void poll()
  }
})

watch(visible, (value) => {
  if (value && props.taskNo) {
    void poll()
  }
  else {
    stopPolling()
  }
})

onBeforeUnmount(stopPolling)

async function poll() {
  stopPolling()
  if (!props.taskNo) {
    return
  }

  loading.value = true
  try {
    await fetchTask()
    await fetchLogs()
    await nextTick(scrollToBottom)
  }
  finally {
    loading.value = false
  }

  if (!isTerminal.value) {
    timer = setTimeout(() => {
      void poll()
    }, 1000)
  }
}

async function fetchTask() {
  const res: any = await getTerminalTask(props.taskNo)
  if (res.code === 200) {
    task.value = res.data
    if (isTerminal.value) {
      emit('finished', res.data)
    }
  }
}

async function fetchLogs() {
  const res: any = await getTerminalLogs(props.taskNo, afterSeq.value, 200)
  if (res.code !== 200) {
    return
  }

  logs.value.push(...res.data.lines)
  afterSeq.value = res.data.next_seq
  if (res.data.has_more) {
    await fetchLogs()
  }
}

function stopPolling() {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

function reset() {
  stopPolling()
  task.value = undefined
  logs.value = []
  afterSeq.value = 0
}

function scrollToBottom() {
  if (!autoScroll.value || !terminalRef.value) {
    return
  }
  terminalRef.value.scrollTop = terminalRef.value.scrollHeight
}

function clearLogs() {
  logs.value = []
}

async function copyLogs() {
  await navigator.clipboard?.writeText(allText.value)
  ElMessage.success(t('copied'))
}

async function cancelTask() {
  if (!props.taskNo || isTerminal.value) {
    return
  }
  await msg.confirm(t('cancelConfirm'))
  await cancelTerminalTask(props.taskNo)
  await poll()
}

function statusType(status?: TerminalStatus) {
  switch (status) {
    case 'success':
      return 'success'
    case 'failed':
    case 'lost':
      return 'danger'
    case 'cancelled':
    case 'expired':
      return 'warning'
    case 'running':
      return 'primary'
    default:
      return 'info'
  }
}

function lineClass(line: TerminalLogLine) {
  return {
    'terminal-line': true,
    'terminal-line--stderr': line.stream === 'stderr' || line.level === 'error',
    'terminal-line--system': line.stream === 'system',
  }
}
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="displayTitle"
    append-to-body
    size="900"
    @closed="stopPolling"
  >
    <div class="plugin-terminal">
      <div class="plugin-terminal__header">
        <div class="plugin-terminal__meta">
          <el-tag :type="statusType(task?.status)">
            {{ t(`status.${task?.status ?? 'pending'}`) }}
          </el-tag>
          <span>{{ t('step') }}：{{ task?.current_step ?? '-' }}</span>
          <span>{{ t('progress') }}：{{ progress }}%</span>
        </div>
        <el-progress :percentage="progress" :status="task?.status === 'failed' ? 'exception' : task?.status === 'success' ? 'success' : undefined" />
      </div>

      <div class="plugin-terminal__toolbar">
        <el-checkbox v-model="autoScroll">
          {{ t('autoScroll') }}
        </el-checkbox>
        <div class="plugin-terminal__actions">
          <el-tooltip :content="t('copy')">
            <el-button circle :disabled="logs.length === 0" @click="copyLogs">
              <ma-svg-icon name="i-lucide:copy" :size="16" />
            </el-button>
          </el-tooltip>
          <el-tooltip :content="t('clear')">
            <el-button circle :disabled="logs.length === 0" @click="clearLogs">
              <ma-svg-icon name="i-lucide:trash-2" :size="16" />
            </el-button>
          </el-tooltip>
          <el-button
            v-auth="['plugin:store:terminal:cancel']"
            :disabled="!task || isTerminal"
            type="warning"
            @click="cancelTask"
          >
            <ma-svg-icon name="i-lucide:circle-stop" :size="16" class="mr-1" />
            {{ t('cancel') }}
          </el-button>
        </div>
      </div>

      <div ref="terminalRef" v-loading="loading && logs.length === 0" class="plugin-terminal__screen">
        <div v-if="logs.length === 0" class="plugin-terminal__empty">
          {{ t('empty') }}
        </div>
        <div v-for="line in logs" :key="line.seq" :class="lineClass(line)">
          <span class="terminal-line__time">{{ line.time }}</span>
          <span class="terminal-line__stream">{{ line.stream }}</span>
          <span class="terminal-line__message">{{ line.message }}</span>
        </div>
      </div>

      <div class="plugin-terminal__footer">
        <el-alert
          v-if="isTerminal"
          :type="task?.status === 'success' ? 'success' : 'warning'"
          :closable="false"
          :title="task?.error_message || t('terminalDone')"
        />
        <el-button @click="visible = false">
          {{ t('close') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.plugin-terminal {
  @apply flex h-full flex-col gap-3;

  &__header {
    @apply shrink-0;
  }

  &__meta {
    @apply mb-2 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300;
  }

  &__toolbar {
    @apply flex shrink-0 items-center justify-between gap-3;
  }

  &__actions {
    @apply flex items-center gap-2;
  }

  &__screen {
    @apply min-h-360px flex-1 overflow-auto rounded bg-[#111827] p-3 font-mono text-[12px] leading-5 text-gray-100;
  }

  &__empty {
    @apply text-gray-500;
  }

  &__footer {
    @apply flex shrink-0 items-center justify-between gap-3;
  }
}

.terminal-line {
  @apply grid gap-2 whitespace-pre-wrap break-words;

  grid-template-columns: 138px 58px minmax(0, 1fr);

  &--stderr {
    @apply text-red-300;
  }

  &--system {
    @apply text-cyan-200;
  }

  &__time {
    @apply text-gray-500;
  }

  &__stream {
    @apply text-gray-400;
  }
}
</style>
