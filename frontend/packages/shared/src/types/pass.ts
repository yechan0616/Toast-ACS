export type PassType = 'TIME' | 'PERIOD'

export interface ActivateResult {
  passType: PassType
  expiresAt: string
  seat: string | null
}

export interface PassSummary {
  serviceName: string
  gateName: string
  passType: PassType
  expiresAt: string
  inside: boolean
  entryCount: number
  seat: string | null
}

export type PassRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface PassRequestCreate {
  applicantName: string
  phone: string
  seat: string
  reason?: string
}

export interface PassRequestCreated {
  requestId: string
}

export interface PassRequestState {
  status: PassRequestStatus
  code?: string
  passType?: PassType
  expiresAt?: string
  seat?: string
  rejectReason?: string
}

export interface SeatStatus {
  seat: string
  taken: boolean
}
