import type { AnyErrorCode } from '@toast-acs/shared'

const MESSAGES: Partial<Record<AnyErrorCode, string>> = {
  SESSION_REQUIRED: '기기 등록이 필요해요. 서비스를 다시 등록해 주세요.',
  TOKEN_EXPIRED: '인증이 만료됐어요. 다시 시도해 주세요.',
  TOKEN_REUSED: '조금 전 요청과 겹쳤어요. 잠시 후 다시 눌러 주세요.',
  SESSION_KILLED: '다른 기기에서 등록해서 이 기기의 연결이 끊겼어요.',
  NO_PRESENCE: '게이트 앞으로 이동해 주세요.',
  ALREADY_INSIDE: '이미 입장해 있어요. 먼저 퇴장해 주세요.',
  NOT_INSIDE: '입장 기록이 없어요. 먼저 입장해 주세요.',
  PASS_EXPIRED:
    '이용 기간이 끝났어요. 서비스를 다시 요청하면 이용할 수 있어요.',
  PASS_NOT_FOUND: '인증코드를 다시 확인해 주세요.',
}

export function denialMessage(code: AnyErrorCode, fallback: string) {
  return MESSAGES[code] ?? fallback
}

const REAUTH_CODES = new Set<AnyErrorCode>([
  'SESSION_REQUIRED',
  'TOKEN_EXPIRED',
  'SESSION_KILLED',
])

export function needsReauth(code: AnyErrorCode) {
  return REAUTH_CODES.has(code)
}
