'use client'

import { ALERT_TYPE_LABEL, formatTime } from 'features/logs/alertLabels'
import { fetchAlerts } from 'features/logs/api'
import { useCallback } from 'react'
import * as T from 'shared/adminTable'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './AlertFeed.styled'

const POLL_MS = 3000

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
      <S.Title>경보</S.Title>
      {alerts.length > 0 ? (
        <S.List>
          {alerts.map((alert) => (
            <S.Item key={alert.id}>
              <S.IconCircle>
                <AlertGlyph />
              </S.IconCircle>
              <S.Content>
                <S.Type>{ALERT_TYPE_LABEL[alert.type]}</S.Type>
                <S.Detail>{alert.detail}</S.Detail>
              </S.Content>
              <S.Time>{formatTime(alert.createdAt)}</S.Time>
            </S.Item>
          ))}
        </S.List>
      ) : (
        <S.Empty>
          {error ? '경보를 불러오지 못했어요.' : '아직 올라온 경보가 없어요.'}
        </S.Empty>
      )}
      {hasMore && (
        <S.MoreRow>
          <T.PageButton type='button' onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? '불러오는 중…' : '더 보기'}
          </T.PageButton>
        </S.MoreRow>
      )}
    </S.Section>
  )
}
