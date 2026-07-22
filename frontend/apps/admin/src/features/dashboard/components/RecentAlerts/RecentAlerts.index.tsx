'use client'

import { ALERT_TYPE_LABEL, formatTime } from 'features/logs/alertLabels'
import { fetchAlerts } from 'features/logs/api'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { usePolling } from 'shared/usePolling'
import * as S from './RecentAlerts.styled'

const POLL_MS = 3000
const VISIBLE_COUNT = 5

function AlertGlyph() {
  return (
    <svg
      width='16'
      height='16'
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
        d='M12 10v4M12 16.4v.2'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export function RecentAlerts() {
  const router = useRouter()
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchAlerts(0, signal),
    [],
  )
  const { data, error } = usePolling(fetcher, POLL_MS)

  const alerts = (data?.content ?? []).slice(0, VISIBLE_COUNT)

  return (
    <S.Section>
      <S.Head>
        <S.Title>최근 경보</S.Title>
        <S.MoreLink type='button' onClick={() => router.push('/logs')}>
          전체 보기
        </S.MoreLink>
      </S.Head>
      {alerts.length > 0 ? (
        <S.List>
          {alerts.map((alert) => (
            <S.Item key={alert.id}>
              <S.IconCircle>
                <AlertGlyph />
              </S.IconCircle>
              <S.Content>
                <S.TypeRow>
                  <S.Type>{ALERT_TYPE_LABEL[alert.type]}</S.Type>
                  <S.TimePill>{formatTime(alert.createdAt)}</S.TimePill>
                </S.TypeRow>
                <S.Detail>{alert.detail}</S.Detail>
              </S.Content>
            </S.Item>
          ))}
        </S.List>
      ) : (
        <S.Empty>
          {error
            ? '경보를 불러오지 못했어요.'
            : '최근 아직 올라온 경보가 없어요.'}
        </S.Empty>
      )}
    </S.Section>
  )
}
