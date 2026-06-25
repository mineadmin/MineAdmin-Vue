const http = useHttp()

export type TerminalAction = 'download' | 'install' | 'uninstall' | 'frontend_deps' | 'backend_deps' | 'install_pnpm' | 'check_environment'
export type TerminalStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'expired' | 'lost'
export type TerminalStream = 'system' | 'stdout' | 'stderr'

export interface TerminalTaskCreateParams {
  action: TerminalAction
  identifier?: string
  version?: string
}

export interface TerminalTask {
  task_no: string
  action?: TerminalAction
  title?: string
  identifier?: string
  version?: string
  status: TerminalStatus
  current_step?: string
  progress?: number
  exit_code?: number | null
  error_message?: string | null
  created_at?: string
  started_at?: string | null
  finished_at?: string | null
  expires_at?: string
}

export interface TerminalLogLine {
  seq: number
  level: 'info' | 'warning' | 'error'
  stream: TerminalStream
  message: string
  time: string
}

export interface TerminalLogs {
  task_no: string
  next_seq: number
  has_more: boolean
  lines: TerminalLogLine[]
}

export function createTerminalTask(data: TerminalTaskCreateParams) {
  return http.post('/admin/plugin/store/terminal/tasks', data)
}

export function getTerminalTask(taskNo: string) {
  return http.get(`/admin/plugin/store/terminal/tasks/${taskNo}`)
}

export function getTerminalLogs(taskNo: string, afterSeq = 0, limit = 200) {
  return http.get(`/admin/plugin/store/terminal/tasks/${taskNo}/logs`, {
    params: {
      after_seq: afterSeq,
      limit,
    },
  })
}

export function cancelTerminalTask(taskNo: string) {
  return http.post(`/admin/plugin/store/terminal/tasks/${taskNo}/cancel`)
}
