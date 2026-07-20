import type { PassRequestStatus, PassType } from './pass'

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface GateStatus {
  online: boolean
  lastSeenAt: string
}

export interface SuspectedPass {
  code: string
  kills: number
}

export interface AdminOverview {
  insideCount: number
  activeSessionCount: number
  pendingRequests: number
  totalEntries: number
  gate: GateStatus
  today: {
    entries: number
    denied: number
    sessionKills: number
    alerts: number
  }
  suspectedPasses: SuspectedPass[]
}

export interface PassRequestItem {
  requestId: string
  applicantName: string
  phone: string
  passType: PassType | null
  ip: string | null
  reason: string | null
  status: PassRequestStatus
  passCode: string | null
  rejectReason: string | null
  createdAt: string
  decidedAt: string | null
}

export interface PassApproveRequest {
  passType: PassType
}

export interface PassApproveResult {
  code: string
  expiresAt: string
}

export interface SessionItem {
  id: number
  passCode: string
  userAgent: string
  createdAt: string
  entryCount: number
}
