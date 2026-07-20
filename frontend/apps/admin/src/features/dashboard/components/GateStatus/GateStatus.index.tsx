'use client'

import type { GateStatus as GateStatusData } from '@toast-acs/shared'
import { Badge } from '@toast-acs/ui'
import * as S from './GateStatus.styled'

function formatSeen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('ko-KR', { hour12: false })
}

export function GateStatus({ gate }: { gate: GateStatusData }) {
  return (
    <S.Card>
      <S.Info>
        <S.Label>게이트</S.Label>
        <S.Seen>마지막 신호 {formatSeen(gate.lastSeenAt)}</S.Seen>
      </S.Info>
      <Badge tone={gate.online ? 'success' : 'danger'}>
        {gate.online && <S.LiveDot />}
        {gate.online ? '온라인' : '오프라인'}
      </Badge>
    </S.Card>
  )
}
