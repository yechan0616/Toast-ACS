export type ErrorCode =
  | 'PASS_NOT_FOUND'
  | 'PASS_EXPIRED'
  | 'PASS_REVOKED'
  | 'SESSION_REQUIRED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_REUSED'
  | 'SESSION_KILLED'
  | 'NO_PRESENCE'
  | 'ALREADY_INSIDE'
  | 'NOT_INSIDE'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'GATE_KEY_INVALID'
  | 'DEVICE_MISMATCH'
  | 'INVALID_REQUEST'
  | 'REQUEST_NOT_FOUND'
  | 'SEAT_INVALID'
  | 'SEAT_TAKEN'
  | 'ALREADY_DECIDED'
  | 'TOO_MANY_ATTEMPTS'

export type AnyErrorCode = ErrorCode | 'NETWORK_ERROR' | 'UNKNOWN'

export interface ErrorEnvelope {
  code: AnyErrorCode
  message: string
}
