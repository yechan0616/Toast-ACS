'use client'

import type { LogType } from '@toast-acs/shared'
import { formatTime } from 'features/logs/alertLabels'
import { fetchLogs } from 'features/logs/api'
import { useCallback, useEffect } from 'react'
import * as T from 'shared/adminTable'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'

const POLL_MS = 3000
const COLS = '220px 150px 110px minmax(140px, 1fr)'
const MIN_WIDTH = '640px'
const DIRECTION_LABEL = { IN: '입장', OUT: '퇴장' } as const

export function AccessLog({ type }: { type: LogType }) {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchLogs({ type, page: 0 }, signal),
    [type],
  )
  const { data, error } = usePolling(fetcher, POLL_MS)

  const fetchPage = useCallback(
    (page: number) => fetchLogs({ type, page }),
    [type],
  )
  const { rows, hasMore, loadingMore, loadMore, reset } = useLoadMore(
    data,
    fetchPage,
    (row) => row.id,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset paging when the log type changes
  useEffect(() => {
    reset()
  }, [type])

  return (
    <div>
      {rows.length > 0 ? (
        <T.TableCard>
          <T.TableInner style={{ minWidth: MIN_WIDTH }}>
            <T.HeadRow style={{ gridTemplateColumns: COLS }}>
              <T.HeadCell>시각</T.HeadCell>
              <T.HeadCell>이용권</T.HeadCell>
              <T.HeadCell>방향</T.HeadCell>
              <T.HeadCell>결과</T.HeadCell>
            </T.HeadRow>
            {rows.map((row) => (
              <T.BodyRow key={row.id}>
                <T.RowGrid style={{ gridTemplateColumns: COLS }}>
                  <T.Cell data-variant='faint'>
                    {formatTime(row.createdAt)}
                  </T.Cell>
                  <T.Cell data-variant='strong'>{row.passCode ?? '-'}</T.Cell>
                  <T.Cell>
                    {row.direction ? DIRECTION_LABEL[row.direction] : '-'}
                  </T.Cell>
                  <T.Cell>{row.denyCode ?? row.result}</T.Cell>
                </T.RowGrid>
              </T.BodyRow>
            ))}
          </T.TableInner>
        </T.TableCard>
      ) : (
        <T.Empty>
          {error ? '로그를 불러오지 못했습니다.' : '기록이 없습니다.'}
        </T.Empty>
      )}
      {hasMore && (
        <T.Pagination>
          <T.PageButton type='button' onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? '불러오는 중…' : '더 보기'}
          </T.PageButton>
        </T.Pagination>
      )}
    </div>
  )
}
