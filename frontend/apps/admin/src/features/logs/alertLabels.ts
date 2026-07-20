import type { AlertType } from '@toast-acs/shared'

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  TAILGATE: '뒤따라 들어가기',
  UNAUTH_APPROACH: '미인증 접근',
  GATE_OFFLINE: '게이트 오프라인',
  SHARE_SUSPECT: '공유 의심',
}

export function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('ko-KR', { hour12: false })
}
