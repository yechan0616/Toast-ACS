import type {
  ActivateResult,
  PassRequestCreate,
  PassRequestCreated,
  PassRequestState,
  PassSummary,
} from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export function fetchMe(signal?: AbortSignal) {
  return api.get<PassSummary>('/api/me', signal)
}

export function activatePass(code: string) {
  return api.post<ActivateResult>('/api/passes/activate', { code })
}

export function createPassRequest(body: PassRequestCreate) {
  return api.post<PassRequestCreated>('/api/passes/request', body)
}

export function fetchPassRequest(requestId: string, signal?: AbortSignal) {
  return api.get<PassRequestState>(`/api/passes/requests/${requestId}`, signal)
}
