import type { AlertPage, LogPage, LogType } from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export const PAGE_SIZE = 20

interface LogQuery {
  type?: LogType
  page?: number
  size?: number
}

export function fetchLogs(query: LogQuery, signal?: AbortSignal) {
  const params = new URLSearchParams()
  if (query.type) params.set('type', query.type)
  params.set('page', String(query.page ?? 0))
  params.set('size', String(query.size ?? PAGE_SIZE))
  return api.get<LogPage>(`/api/admin/logs?${params.toString()}`, signal)
}

export function fetchAlerts(page = 0, signal?: AbortSignal) {
  return api.get<AlertPage>(`/api/admin/alerts?page=${page}`, signal)
}
