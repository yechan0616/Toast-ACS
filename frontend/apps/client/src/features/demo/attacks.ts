import type { AnyErrorCode } from '@toast-acs/shared'
import type { AttackOutcome } from './api'
import {
  attackActivate,
  attackEntry,
  attackEntryNoSession,
  attackEntryOut,
  runAttack,
} from './api'

export interface AttackDef {
  id: string
  label: string
  description: string
  precondition: string
  expected: AnyErrorCode
  run: () => Promise<AttackOutcome>
}

export function buildAttacks(
  registered: boolean,
  inside: boolean,
): AttackDef[] {
  return [
    {
      id: 'no-session',
      label: '미각인 입장 시도',
      description: '기기 각인(쿠키) 없이 입장을 요청해요.',
      precondition: '사전조건 없음 — 쿠키를 뺀 요청이라 언제든 재현돼요.',
      expected: 'SESSION_REQUIRED',
      run: () => runAttack(attackEntryNoSession),
    },
    {
      id: 'unknown-pass',
      label: '위조 이용권',
      description: '존재하지 않는 인증코드로 기기 등록을 시도해요.',
      precondition: '사전조건 없음 — 없는 코드라 언제든 재현돼요.',
      expected: 'PASS_NOT_FOUND',
      run: () => runAttack(() => attackActivate('INVALID-DEMO-CODE')),
    },
    {
      id: 'remote-entry',
      label: '원격 통과',
      description: '게이트 앞에 사람이 없는데 원격에서 통과를 요청해요.',
      precondition: registered
        ? '게이트 앞에 사람이 없으면 재현돼요.'
        : '등록된 기기가 필요해요 — 지금은 미각인이라 각인부터 막혀요.',
      expected: registered ? 'NO_PRESENCE' : 'SESSION_REQUIRED',
      run: () => runAttack(inside ? attackEntryOut : attackEntry),
    },
    {
      id: 'anti-passback',
      label: '안티패스백 위반',
      description: inside
        ? '이미 입장한 상태에서 다시 입장을 요청해요.'
        : '입장 기록 없이 퇴장을 요청해요.',
      precondition: registered
        ? '이미 처리된 방향을 다시 요청하면 재현돼요.'
        : '등록된 기기가 필요해요 — 지금은 미각인이라 각인부터 막혀요.',
      expected: registered
        ? inside
          ? 'ALREADY_INSIDE'
          : 'NOT_INSIDE'
        : 'SESSION_REQUIRED',
      run: () => runAttack(inside ? attackEntry : attackEntryOut),
    },
  ]
}
