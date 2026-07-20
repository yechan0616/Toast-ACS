'use client'

import { Badge, Button } from '@toast-acs/ui'
import type { AttackOutcome } from 'features/demo/api'
import { buildAttacks } from 'features/demo/attacks'
import { fetchMe } from 'features/pass/api'
import { useEffect, useState } from 'react'
import * as S from './AttackPanel.styled'

const KEEPALIVE_MS = 25000

export function AttackPanel() {
  const [results, setResults] = useState<Record<string, AttackOutcome>>({})
  const [running, setRunning] = useState<string | null>(null)
  const [registered, setRegistered] = useState<boolean | null>(null)
  const [inside, setInside] = useState(false)

  const readState = async () => {
    try {
      const me = await fetchMe()
      setRegistered(true)
      setInside(me.inside)
      return { registered: true, inside: me.inside }
    } catch {
      setRegistered(false)
      return { registered: false, inside: false }
    }
  }

  useEffect(() => {
    let active = true
    const refresh = async () => {
      if (!active) return
      await readState()
    }
    refresh()
    const id = setInterval(refresh, KEEPALIVE_MS)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  const attacks = buildAttacks(registered === true, inside)

  const handleRun = async (id: string) => {
    setRunning(id)
    const state = await readState()
    const attack = buildAttacks(state.registered, state.inside).find(
      (a) => a.id === id,
    )
    if (attack) {
      const outcome = await attack.run()
      setResults((prev) => ({ ...prev, [id]: outcome }))
    }
    setRunning(null)
  }

  return (
    <S.Main>
      <S.Head>
        <S.Title>공격 시연</S.Title>
        <S.Sub>
          실제 API를 공격 조건 그대로 호출해 서버가 거부하는 코드를 확인해요.
          전용 우회 엔드포인트는 없어요.
        </S.Sub>
      </S.Head>
      {registered === false && (
        <S.Guide>
          원격 입장·무단 퇴장은 등록된 기기에서 재현돼요. 먼저 이용권을 등록한
          뒤 실행해 주세요.
        </S.Guide>
      )}
      <S.List>
        {attacks.map((attack) => {
          const result = results[attack.id]
          const blocked = result?.blocked === true
          return (
            <S.Item key={attack.id}>
              <S.ItemHead>
                <S.ItemLabel>{attack.label}</S.ItemLabel>
                <S.ItemDesc>{attack.description}</S.ItemDesc>
                <S.Precondition>{attack.precondition}</S.Precondition>
              </S.ItemHead>
              <Button
                design='line'
                size='small'
                onClick={() => handleRun(attack.id)}
                disabled={running === attack.id}
              >
                {running === attack.id ? '실행 중…' : '실행'}
              </Button>
              {result && (
                <S.Outcome>
                  <Badge tone={blocked ? 'success' : 'danger'}>
                    {blocked ? '✓ 서버가 차단했어요' : '✗ 통과됨 — 방어 실패'}
                  </Badge>
                  <S.Result>
                    <S.ResultCode>{result.code}</S.ResultCode>
                    <S.OutcomeText>{result.message}</S.OutcomeText>
                  </S.Result>
                </S.Outcome>
              )}
            </S.Item>
          )
        })}
      </S.List>
      <S.Note>
        회전 토큰 방어(만료·재사용)는 시간창·동시 요청 조건이 필요해서, 게이트
        현장에서 확인해요.
      </S.Note>
    </S.Main>
  )
}
