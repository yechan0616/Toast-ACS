'use client'

import { Badge, Button } from '@toast-acs/ui'
import type { AttackOutcome } from 'features/demo/api'
import { buildAttacks, resolveStop } from 'features/demo/attacks'
import { fetchMe } from 'features/pass/api'
import { useEffect, useState } from 'react'
import * as S from './AttackPanel.styled'

const KEEPALIVE_MS = 25000

type LayerStatus = 'pass' | 'block' | 'skip'

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
      if (active) await readState()
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
    setResults((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
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
          실제 API를 공격 조건 그대로 호출해요. 요청이 방어 계층을 지나다 어디서
          막히는지 눈으로 확인해요.
        </S.Sub>
      </S.Head>
      {registered === false && (
        <S.Guide>
          원격 통과·안티패스백은 등록된 기기에서 재현돼요. 먼저 이용권을 등록한
          뒤 실행해 주세요.
        </S.Guide>
      )}
      <S.List>
        {attacks.map((attack) => {
          const outcome = results[attack.id]
          const stop = outcome
            ? outcome.blocked
              ? resolveStop(attack.layers, outcome.code)
              : -1
            : null
          const passedElsewhere = outcome?.blocked === true && stop === -1
          return (
            <S.Item key={attack.id}>
              <S.ItemHead>
                <S.ItemLabel>{attack.label}</S.ItemLabel>
                <S.ItemDesc>{attack.description}</S.ItemDesc>
              </S.ItemHead>
              <Button
                design='line'
                size='small'
                onClick={() => handleRun(attack.id)}
                disabled={running === attack.id}
              >
                {running === attack.id ? '통과 중…' : '공격 실행'}
              </Button>
              {outcome && stop !== null && (
                <S.Pipeline>
                  {attack.layers.map((layer, i) => {
                    const status: LayerStatus =
                      stop < 0
                        ? 'pass'
                        : i < stop
                          ? 'pass'
                          : i === stop
                            ? 'block'
                            : 'skip'
                    const delay =
                      status === 'skip'
                        ? 0
                        : Math.min(
                            i,
                            (stop < 0 ? attack.layers.length : stop) + 1,
                          ) * 0.24
                    return (
                      <S.Layer
                        key={layer.label}
                        data-status={status}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay }}
                      >
                        <S.LayerMark data-status={status}>
                          {status === 'pass'
                            ? '✓'
                            : status === 'block'
                              ? '✗'
                              : '·'}
                        </S.LayerMark>
                        {layer.label}
                      </S.Layer>
                    )
                  })}
                  {passedElsewhere && (
                    <S.Layer
                      data-status='block'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: attack.layers.length * 0.24 }}
                    >
                      <S.LayerMark data-status='block'>✗</S.LayerMark>
                      서버 거부
                    </S.Layer>
                  )}
                  <S.Verdict
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay:
                        ((stop < 0 ? attack.layers.length : stop) + 1) * 0.24,
                    }}
                  >
                    <Badge tone={outcome.blocked ? 'success' : 'danger'}>
                      {outcome.blocked ? '차단됨' : '통과됨 — 방어 실패'}
                    </Badge>
                    <S.VerdictText>
                      <S.ResultCode>{outcome.code}</S.ResultCode>
                      {outcome.message}
                    </S.VerdictText>
                  </S.Verdict>
                </S.Pipeline>
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
