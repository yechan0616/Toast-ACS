'use client'

import { Badge, SectionTitle } from '@toast-acs/ui'
import { ALERT_TYPE_LABEL, formatTime } from 'features/logs/alertLabels'
import { fetchAlerts } from 'features/logs/api'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { usePolling } from 'shared/usePolling'
import * as S from './RecentAlerts.styled'

const POLL_MS = 3000
const VISIBLE_COUNT = 5

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
        <SectionTitle>최근 경보</SectionTitle>
        <S.MoreLink type='button' onClick={() => router.push('/logs')}>
          전체 보기
        </S.MoreLink>
      </S.Head>
      {alerts.length > 0 ? (
        <S.List>
          {alerts.map((alert) => (
            <S.Item key={alert.id}>
              <Badge tone='danger'>{ALERT_TYPE_LABEL[alert.type]}</Badge>
              <S.Message>{alert.detail}</S.Message>
              <S.Time>{formatTime(alert.createdAt)}</S.Time>
            </S.Item>
          ))}
        </S.List>
      ) : (
        <S.Empty>
          {error ? '경보를 불러오지 못했습니다.' : '최근 경보가 없습니다.'}
        </S.Empty>
      )}
    </S.Section>
  )
}
