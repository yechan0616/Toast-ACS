'use client'

import type { AdminOverview } from '@toast-acs/shared'
import { easeOutExpo, fadeUpSoft, staggerSlow } from '@toast-acs/ui'
import * as S from './LiveStatus.styled'

interface Stat {
  label: string
  value: number
  tone?: 'accent' | 'danger'
  href?: string
}

export function LiveStatus({ overview }: { overview: AdminOverview }) {
  const stats: Stat[] = [
    { label: '재실 인원', value: overview.insideCount, tone: 'accent' },
    { label: '활성 세션', value: overview.activeSessionCount },
    {
      label: '승인 대기',
      value: overview.pendingRequests,
      tone: 'accent',
      href: '/requests',
    },
    { label: '누적 출입', value: overview.totalEntries },
    { label: '오늘 입장', value: overview.today.entries },
    { label: '오늘 거부', value: overview.today.denied, tone: 'danger' },
    { label: '오늘 세션 킬', value: overview.today.sessionKills },
    { label: '오늘 경보', value: overview.today.alerts, tone: 'danger' },
  ]

  return (
    <S.Grid variants={staggerSlow} initial='hidden' animate='visible'>
      {stats.map((stat) => {
        const tile = (
          <S.Stat>
            <S.Label>{stat.label}</S.Label>
            <S.Value
              key={stat.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              data-tone={stat.tone && stat.value > 0 ? stat.tone : 'none'}
            >
              {stat.value}
            </S.Value>
          </S.Stat>
        )
        return (
          <S.Cell key={stat.label} variants={fadeUpSoft}>
            {stat.href ? (
              <S.StatLink href={stat.href}>{tile}</S.StatLink>
            ) : (
              tile
            )}
          </S.Cell>
        )
      })}
    </S.Grid>
  )
}
