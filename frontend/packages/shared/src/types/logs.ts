export interface Page<T> {
  content: T[]
  page: number
  totalPages: number
}

export type LogType = 'ENTRY' | 'DENIED' | 'SESSION_KILL'

export interface LogEntry {
  id: number
  passCode: string | null
  direction: 'IN' | 'OUT' | null
  result: string
  denyCode: string | null
  createdAt: string
}

export type LogPage = Page<LogEntry>

export type AlertType =
  | 'TAILGATE'
  | 'UNAUTH_APPROACH'
  | 'GATE_OFFLINE'
  | 'SHARE_SUSPECT'

export interface Alert {
  id: number
  type: AlertType
  detail: string
  createdAt: string
}

export type AlertPage = Page<Alert>
