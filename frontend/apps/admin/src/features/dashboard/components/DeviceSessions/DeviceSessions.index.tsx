'use client'

import type { SessionItem } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { fetchSessions, revokePass } from 'features/dashboard/api'
import { formatTime } from 'features/logs/alertLabels'
import { useCallback, useState } from 'react'
import * as T from 'shared/adminTable'
import { useToast } from 'shared/toast/ToastProvider'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './DeviceSessions.styled'

const POLL_MS = 3000
const COLS = '130px minmax(240px, 1fr) 80px 180px 120px'
const MIN_WIDTH = '860px'

export function DeviceSessions() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchSessions(0, signal),
    [],
  )
  const { data, error } = usePolling(fetcher, POLL_MS)

  const fetchPage = useCallback((page: number) => fetchSessions(page), [])
  const {
    rows: pagedRows,
    hasMore,
    loadingMore,
    loadMore,
  } = useLoadMore(data, fetchPage, (row) => row.id)

  const { notify } = useToast()
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [revokeReason, setRevokeReason] = useState('')
  const [actingId, setActingId] = useState<number | null>(null)
  const [revokedCodes, setRevokedCodes] = useState<string[]>([])

  const rows = pagedRows.filter((row) => !revokedCodes.includes(row.passCode))

  const handleRevokeStart = (row: SessionItem) => {
    setConfirmingId(row.id)
    setRevokeReason('')
  }

  const handleRevoke = async (row: SessionItem) => {
    const reason = revokeReason.trim()
    if (!reason) return
    setActingId(row.id)
    try {
      await revokePass(row.passCode, reason)
      setRevokedCodes((prev) => [...prev, row.passCode])
      setConfirmingId(null)
      setRevokeReason('')
      notify(`발급 코드 ${row.passCode}를 취소했어요.`, 'success')
    } catch (err) {
      notify(
        err instanceof ApiError
          ? err.message
          : '취소하지 못했어요. 잠시 후 다시 시도해 주세요.',
        'danger',
      )
    } finally {
      setActingId(null)
    }
  }

  return (
    <S.Page>
      <T.PageHeader>
        <div>
          <T.PageTitle>활성 기기</T.PageTitle>
          <T.PageSub>{rows.length}대가 등록돼 있어요</T.PageSub>
        </div>
      </T.PageHeader>

      {rows.length > 0 ? (
        <T.TableCard>
          <T.TableInner style={{ minWidth: MIN_WIDTH }}>
            <T.HeadRow style={{ gridTemplateColumns: COLS }}>
              <T.HeadCell>이용권 코드</T.HeadCell>
              <T.HeadCell>기기</T.HeadCell>
              <T.HeadCell>출입</T.HeadCell>
              <T.HeadCell>등록 시각</T.HeadCell>
              <T.HeadCell />
            </T.HeadRow>
            {rows.map((row) => (
              <T.BodyRow key={row.id}>
                <T.RowGrid style={{ gridTemplateColumns: COLS }}>
                  <T.Cell data-variant='strong'>{row.passCode}</T.Cell>
                  <T.Cell data-variant='ellipsis' title={row.userAgent}>
                    {row.userAgent}
                  </T.Cell>
                  <T.Cell>{row.entryCount}회</T.Cell>
                  <T.Cell data-variant='faint'>
                    {formatTime(row.createdAt)}
                  </T.Cell>
                  <T.Cell data-variant='actions'>
                    <T.GhostButton
                      type='button'
                      onClick={() => handleRevokeStart(row)}
                      disabled={actingId !== null || confirmingId === row.id}
                    >
                      강제 취소
                    </T.GhostButton>
                  </T.Cell>
                </T.RowGrid>
                {confirmingId === row.id && (
                  <T.InlineForm>
                    <T.InlineInput
                      value={revokeReason}
                      onChange={(event) => setRevokeReason(event.target.value)}
                      placeholder='취소 사유 (필수)'
                      aria-label='취소 사유'
                    />
                    <T.SolidButton
                      type='button'
                      data-tone='danger'
                      onClick={() => handleRevoke(row)}
                      disabled={actingId !== null || revokeReason.trim() === ''}
                    >
                      취소 확정
                    </T.SolidButton>
                    <T.QuietButton
                      type='button'
                      onClick={() => setConfirmingId(null)}
                      disabled={actingId !== null}
                    >
                      닫기
                    </T.QuietButton>
                  </T.InlineForm>
                )}
              </T.BodyRow>
            ))}
          </T.TableInner>
        </T.TableCard>
      ) : (
        <T.Empty>
          {error && !data
            ? '기기 목록을 불러오지 못했어요.'
            : '등록된 기기가 아직 없어요.'}
        </T.Empty>
      )}

      {hasMore && (
        <T.Pagination>
          <T.PageButton type='button' onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? '불러오는 중…' : '더 보기'}
          </T.PageButton>
        </T.Pagination>
      )}
    </S.Page>
  )
}
