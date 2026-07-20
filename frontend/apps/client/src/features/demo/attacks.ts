import type { AnyErrorCode } from '@toast-acs/shared'
import type { AttackOutcome } from './api'
import {
  attackActivate,
  attackEntry,
  attackEntryNoSession,
  attackEntryOut,
  runAttack,
} from './api'

export interface Layer {
  label: string
  codes: AnyErrorCode[]
}

export const ENTRY_LAYERS: Layer[] = [
  { label: '기기 각인(쿠키) 확인', codes: ['SESSION_REQUIRED'] },
  { label: 'HMAC 서명·시간창', codes: ['TOKEN_EXPIRED'] },
  { label: '세션 활성 여부', codes: ['SESSION_KILLED'] },
  { label: '안티패스백(재실 상태)', codes: ['ALREADY_INSIDE', 'NOT_INSIDE'] },
  { label: '현장 확인(초음파)', codes: ['NO_PRESENCE'] },
  { label: '시간창 선점(재사용)', codes: ['TOKEN_REUSED'] },
]

export const ACTIVATE_LAYERS: Layer[] = [
  { label: '이용권 존재 확인', codes: ['PASS_NOT_FOUND'] },
  { label: '취소 여부', codes: ['PASS_REVOKED'] },
  { label: '유효기간', codes: ['PASS_EXPIRED'] },
  { label: '기기 귀속', codes: ['DEVICE_MISMATCH'] },
]

export interface AttackDef {
  id: string
  label: string
  description: string
  layers: Layer[]
  run: () => Promise<AttackOutcome>
}

export function resolveStop(layers: Layer[], code: string): number {
  return layers.findIndex((layer) => layer.codes.includes(code as AnyErrorCode))
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
      layers: ENTRY_LAYERS,
      run: () => runAttack(attackEntryNoSession),
    },
    {
      id: 'unknown-pass',
      label: '위조 이용권',
      description: '존재하지 않는 인증코드로 기기 등록을 시도해요.',
      layers: ACTIVATE_LAYERS,
      run: () => runAttack(() => attackActivate('INVALID-DEMO-CODE')),
    },
    {
      id: 'remote-entry',
      label: '원격 통과',
      description: '게이트 앞에 사람이 없는데 원격에서 통과를 요청해요.',
      layers: ENTRY_LAYERS,
      run: () => runAttack(inside ? attackEntryOut : attackEntry),
    },
    {
      id: 'anti-passback',
      label: '안티패스백 위반',
      description: inside
        ? '이미 입장한 상태에서 다시 입장을 요청해요.'
        : '입장 기록 없이 퇴장을 요청해요.',
      layers: ENTRY_LAYERS,
      run: () => runAttack(inside ? attackEntry : attackEntryOut),
    },
  ]
}
