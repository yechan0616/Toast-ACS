'use client'

import type { LogType } from '@toast-acs/shared'
import type { TabItem } from '@toast-acs/ui'
import { Button, SectionTitle, Table, Tabs, Td, Th } from '@toast-acs/ui'
import { formatTime } from 'features/logs/alertLabels'
import { fetchLogs } from 'features/logs/api'
import { useCallback, useState } from 'react'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './AccessLog.styled'

const POLL_MS = 3000

const TABS: TabItem<LogType>[] = [
  { label: '출입', value: 'ENTRY' },
  { label: '거부', value: 'DENIED' },
  { label: '세션 종료', value: 'SESSION_KILL' },
]

const DIRECTION_LABEL = { IN: '입장', OUT: '퇴장' } as const

export function AccessLog() {
  const [type, setType] = useState<LogType>('ENTRY')

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

  const handleTypeChange = (next: LogType) => {
    setType(next)
    reset()
  }

  return (
    <S.Section>
      <SectionTitle>출입 로그</SectionTitle>
      <Tabs
        items={TABS}
        value={type}
        onChange={handleTypeChange}
        variant='button'
      />
      {rows.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>시각</Th>
              <Th>이용권</Th>
              <Th>방향</Th>
              <Th>결과</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <Td>{formatTime(row.createdAt)}</Td>
                <Td>{row.passCode ?? '-'}</Td>
                <Td>{row.direction ? DIRECTION_LABEL[row.direction] : '-'}</Td>
                <Td>{row.denyCode ?? row.result}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <S.Empty>
          {error ? '로그를 불러오지 못했습니다.' : '기록이 없습니다.'}
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
