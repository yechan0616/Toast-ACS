import type { AdminOverview, Page, SessionItem } from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export function fetchOverview(signal?: AbortSignal) {
  return api.get<AdminOverview>('/api/admin/overview', signal)
}

export function fetchSessions(page = 0, signal?: AbortSignal) {
  return api.get<Page<SessionItem>>(`/api/admin/sessions?page=${page}`, signal)
}

export function openGate(reason?: string) {
  return api.post<void>('/api/admin/gate/open', reason ? { reason } : undefined)
}

export function revokePass(code: string, reason: string) {
  return api.post<void>(
    `/api/admin/passes/${encodeURIComponent(code)}/revoke`,
    {
      reason,
    },
  )
}
