import type { AnyErrorCode } from '@toast-acs/shared'

export interface EntryFeedback {
  allowed: boolean
  code?: AnyErrorCode
  message: string
}
