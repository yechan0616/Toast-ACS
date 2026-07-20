import type { AnyErrorCode, ErrorEnvelope } from '@toast-acs/shared'
import { ApiError, api } from '@toast-acs/shared'

export interface AttackOutcome {
  code: AnyErrorCode | 'NONE'
  message: string
  blocked: boolean
}

export async function runAttack(
  call: () => Promise<unknown>,
): Promise<AttackOutcome> {
  try {
    await call()
    return {
      code: 'NONE',
      message: '차단되지 않았어요. 요청이 통과했어요.',
      blocked: false,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return { code: error.code, message: error.message, blocked: true }
    }
    return {
      code: 'UNKNOWN',
      message: '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
      blocked: true,
    }
  }
}

export const attackEntry = () => api.post('/api/entries', { direction: 'IN' })

export const attackEntryOut = () =>
  api.post('/api/entries', { direction: 'OUT' })

export const attackActivate = (code: string) =>
  api.post('/api/passes/activate', { code })

export async function attackEntryNoSession() {
  const response = await fetch('/api/entries', {
    method: 'POST',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction: 'IN' }),
  })
  if (response.ok) return
  let envelope: ErrorEnvelope = {
    code: 'UNKNOWN',
    message: '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
  }
  try {
    const parsed = (await response.json()) as Partial<ErrorEnvelope>
    if (parsed && typeof parsed.code === 'string') {
      envelope = {
        code: parsed.code as AnyErrorCode,
        message: parsed.message ?? envelope.message,
      }
    }
  } catch {}
  throw new ApiError(envelope, response.status)
}
