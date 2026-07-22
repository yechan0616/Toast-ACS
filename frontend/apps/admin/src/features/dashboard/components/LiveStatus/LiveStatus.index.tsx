'use client'

import type { AdminOverview } from '@toast-acs/shared'
import { cardPop, gridStagger } from '@toast-acs/ui'
import type { ReactNode } from 'react'
import { useCountUp } from 'shared/useCountUp'
import * as S from './LiveStatus.styled'

interface Stat {
  label: string
  value: number
  tone?: 'accent' | 'danger'
  href?: string
  icon: ReactNode
}

function StatValue({
  value,
  tone,
}: {
  value: number
  tone: 'accent' | 'danger' | 'none'
}) {
  const shown = useCountUp(value)
  return <S.Value data-tone={tone}>{shown.toLocaleString()}</S.Value>
}

function PeopleIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='9' cy='8' r='3.2' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
      <path
        d='M16 6.5a3 3 0 0 1 0 5.4M17.5 19c0-2.4-1-4-2.6-4.6'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

function SessionIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='3'
        y='4'
        width='18'
        height='13'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M8 21h8M12 17v4'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

function PendingIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='4'
        y='3'
        width='16'
        height='18'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M8 8h8M8 12h8M8 16h4'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M12 4l8 14H4l8-14Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
      <path
        d='M12 10v4M12 16.5v.5'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export function LiveStatus({ overview }: { overview: AdminOverview }) {
  const stats: Stat[] = [
    {
      label: '재실 인원',
      value: overview.insideCount,
      tone: 'accent',
      icon: <PeopleIcon />,
    },
    {
      label: '활성 세션',
      value: overview.activeSessionCount,
      icon: <SessionIcon />,
    },
    {
      label: '승인 대기',
      value: overview.pendingRequests,
      tone: 'accent',
      href: '/requests',
      icon: <PendingIcon />,
    },
    {
      label: '오늘 경보',
      value: overview.today.alerts,
      tone: 'danger',
      icon: <AlertIcon />,
    },
  ]

  return (
    <S.Grid variants={gridStagger} initial='hidden' animate='visible'>
      {stats.map((stat) => {
        const active = Boolean(stat.tone && stat.value > 0)
        const tone = active && stat.tone ? stat.tone : 'none'
        const tile = (
          <S.Stat>
            <S.Top>
              <S.Label>{stat.label}</S.Label>
              <S.IconBadge data-tone={tone}>{stat.icon}</S.IconBadge>
            </S.Top>
            <StatValue value={stat.value} tone={tone} />
          </S.Stat>
        )
        return (
          <S.Cell
            key={stat.label}
            variants={cardPop}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          >
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
