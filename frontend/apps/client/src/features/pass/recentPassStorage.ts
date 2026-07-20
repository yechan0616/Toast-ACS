import type { PassType } from '@toast-acs/shared'

export interface RecentPass {
  code: string
  expiresAt: string
  passType?: PassType
  serviceName?: string
  gateName?: string
  expired?: boolean
  expiredReason?: string
}

const STORAGE_KEY = 'acs-recent-pass'

export function getRecentPass(): RecentPass | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as RecentPass
    if (typeof parsed.code !== 'string') return null
    if (typeof parsed.expiresAt !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

export function saveRecentPass(pass: RecentPass) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pass))
}

export function markRecentPassExpired(reason?: string): RecentPass | null {
  const recent = getRecentPass()
  if (!recent) return null
  const expired = {
    ...recent,
    expired: true,
    expiredReason: reason ?? recent.expiredReason,
  }
  saveRecentPass(expired)
  return expired
}
