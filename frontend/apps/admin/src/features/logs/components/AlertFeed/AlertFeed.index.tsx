'use client'

import { Badge, Button, SectionTitle } from '@toast-acs/ui'
import { ALERT_TYPE_LABEL, formatTime } from 'features/logs/alertLabels'
import { fetchAlerts } from 'features/logs/api'
import { useCallback } from 'react'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './AlertFeed.styled'

const POLL_MS = 3000

export function AlertFeed() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchAlerts(0, signal),
    [],
  )
  const { data, error } = usePolling(fetcher, POLL_MS)

  const fetchPage = useCallback((page: number) => fetchAlerts(page), [])
  const {
    rows: alerts,
    hasMore,
    loadingMore,
    loadMore,
  } = useLoadMore(data, fetchPage, (alert) => alert.id)

  return (
    <S.Section>
      <SectionTitle>경보</SectionTitle>
      {alerts.length > 0 ? (
        <S.List>
          {alerts.map((alert) => (
            <S.Item key={alert.id}>
              <S.Top>
                <Badge tone='danger'>{ALERT_TYPE_LABEL[alert.type]}</Badge>
                <S.Time>{formatTime(alert.createdAt)}</S.Time>
              </S.Top>
              <S.Message>{alert.detail}</S.Message>
            </S.Item>
          ))}
        </S.List>
      ) : (
        <S.Empty>
          {error ? '경보를 불러오지 못했습니다.' : '경보가 없습니다.'}
        </S.Empty>
      )}
      {hasMore && (
        <S.MoreRow>
          <Button
            design='line'
            size='small'
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? '불러오는 중…' : '더 보기'}
          </Button>
        </S.MoreRow>
      )}
    </S.Section>
  )
}
