export type PassType = 'TIME' | 'PERIOD'

export interface ActivateRequest {
  code: string
}

export interface ActivateResult {
  passType: PassType
  expiresAt: string
}

export interface PassSummary {
  serviceName: string
  gateName: string
  passType: PassType
  expiresAt: string
  inside: boolean
  entryCount: number
}

export type PassRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface PassRequestCreate {
  applicantName: string
  phone: string
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
  rejectReason?: string
}
