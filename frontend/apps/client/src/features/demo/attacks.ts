import type { AnyErrorCode } from '@toast-acs/shared'
import type { AttackOutcome } from './api'
import {
  attackActivate,
  attackAdminAccess,
  attackEntry,
  attackEntryNoSession,
  attackEntryOut,
  attackGatePoll,
  attackInvalidRequest,
  runAttack,
  runBruteForce,
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
  group: string
  label: string
  description: string
  layers: Layer[]
  run: () => Promise<AttackOutcome>
}

export function resolveStop(layers: Layer[], code: string): number {
  return layers.findIndex((layer) => layer.codes.includes(code as AnyErrorCode))
}

export function buildAttacks(inside: boolean): AttackDef[] {
  return [
    {
      id: 'no-session',
      group: '출입 인증',
      label: '미각인 입장 시도',
      description: '기기 각인(쿠키) 없이 입장을 요청해요.',
      layers: ENTRY_LAYERS,
      run: () => runAttack(attackEntryNoSession),
    },
    {
      id: 'remote-entry',
      group: '출입 인증',
      label: '원격 통과',
      description: '게이트 앞에 사람이 없는데 원격에서 통과를 요청해요.',
      layers: ENTRY_LAYERS,
      run: () => runAttack(inside ? attackEntryOut : attackEntry),
    },
    {
      id: 'anti-passback',
      group: '출입 인증',
      label: '안티패스백 위반',
      description: inside
        ? '이미 입장한 상태에서 다시 입장을 요청해요.'
        : '입장 기록 없이 퇴장을 요청해요.',
      layers: ENTRY_LAYERS,
      run: () => runAttack(inside ? attackEntry : attackEntryOut),
    },
    {
      id: 'unknown-pass',
      group: '이용권·등록',
      label: '위조 이용권',
      description: '존재하지 않는 인증코드로 기기 등록을 시도해요.',
      layers: ACTIVATE_LAYERS,
      run: () => runAttack(() => attackActivate('INVALID-DEMO-CODE')),
    },
    {
      id: 'invalid-request',
      group: '이용권·등록',
      label: '형식 위반 요청',
      description: '필수 값을 빼고 이용권 신청을 보내요.',
      layers: [{ label: '요청 형식 검증', codes: ['INVALID_REQUEST'] }],
      run: () => runAttack(attackInvalidRequest),
    },
    {
      id: 'brute-force',
      group: '인프라 방어',
      label: '무차별 대입',
      description: '관리자 로그인을 틀린 비밀번호로 연속 시도해요.',
      layers: [{ label: 'IP당 시도 횟수 제한', codes: ['TOO_MANY_ATTEMPTS'] }],
      run: runBruteForce,
    },
    {
      id: 'admin-access',
      group: '인프라 방어',
      label: '관리자 무단 접근',
      description: '로그인 없이 관리자 대시보드 API를 호출해요.',
      layers: [{ label: '관리자 세션 확인', codes: ['UNAUTHORIZED'] }],
      run: () => runAttack(attackAdminAccess),
    },
    {
      id: 'gate-forge',
      group: '인프라 방어',
      label: '게이트 위조',
      description: '게이트 키 없이 게이트 폴링을 호출해요.',
      layers: [{ label: '게이트 키 검증', codes: ['GATE_KEY_INVALID'] }],
      run: () => runAttack(attackGatePoll),
    },
  ]
}
