import type {
  Page,
  PassApproveRequest,
  PassApproveResult,
  PassRequestItem,
  PassRequestStatus,
  PassType,
} from '@toast-acs/shared'
import { api } from '@toast-acs/shared'

export function fetchPassRequests(
  status: PassRequestStatus,
  page = 0,
  signal?: AbortSignal,
) {
  return api.get<Page<PassRequestItem>>(
    `/api/admin/pass-requests?status=${status}&page=${page}`,
    signal,
  )
}

export function approvePassRequest(requestId: string, passType: PassType) {
  const body: PassApproveRequest = { passType }
  return api.post<PassApproveResult>(
    `/api/admin/pass-requests/${requestId}/approve`,
    body,
  )
}

export function rejectPassRequest(requestId: string, reason?: string) {
  return api.post<void>(
    `/api/admin/pass-requests/${requestId}/reject`,
    reason ? { reason } : undefined,
  )
}
