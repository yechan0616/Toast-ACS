'use client'

import type { PassRequestItem, PassType } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import {
  approvePassRequest,
  fetchPassRequests,
  rejectPassRequest,
} from 'features/requests/api'
import { Fragment, useCallback, useState } from 'react'
import * as T from 'shared/adminTable'
import { useToast } from 'shared/toast/ToastProvider'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './PassRequests.styled'

const POLL_MS = 3000
const COLS = '110px 140px 60px 130px 150px minmax(180px, 1fr) 150px'
const MIN_WIDTH = '900px'

const PASS_TYPE_OPTIONS: { value: PassType; label: string }[] = [
  { value: 'TIME', label: '시간권 · 24시간' },
  { value: 'PERIOD', label: '기간권 · 30일' },
]

function formatShort(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function PassRequests() {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchPassRequests('PENDING', 0, signal),
    [],
  )
  const { data, error } = usePolling(fetcher, POLL_MS)

  const fetchPage = useCallback(
    (page: number) => fetchPassRequests('PENDING', page),
    [],
  )
  const {
    rows: pagedRows,
    hasMore,
    loadingMore,
    loadMore,
  } = useLoadMore(data, fetchPage, (row) => row.requestId)

  const { notify } = useToast()
  const [actingId, setActingId] = useState<string | null>(null)
  const [decidedIds, setDecidedIds] = useState<string[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [approveType, setApproveType] = useState<PassType | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const rows = pagedRows.filter((row) => !decidedIds.includes(row.requestId))

  const markDecided = (requestId: string) => {
    setDecidedIds((prev) => [...prev, requestId])
  }

  const handleApproveStart = (row: PassRequestItem) => {
    setApprovingId(row.requestId)
    setApproveType(null)
    setRejectingId(null)
  }

  const handleApprove = async (row: PassRequestItem) => {
    if (!approveType) return
    setActingId(row.requestId)
    try {
      const result = await approvePassRequest(row.requestId, approveType)
      markDecided(row.requestId)
      setApprovingId(null)
      setApproveType(null)
      notify(
        `${row.applicantName} 님 승인 완료 · 발급 코드 ${result.code}`,
        'success',
      )
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ALREADY_DECIDED') {
        markDecided(row.requestId)
      }
      notify(
        err instanceof ApiError ? err.message : '승인에 실패했습니다.',
        'danger',
      )
    } finally {
      setActingId(null)
    }
  }

  const handleRejectStart = (row: PassRequestItem) => {
    setRejectingId(row.requestId)
    setRejectReason('')
    setApprovingId(null)
  }

  const handleReject = async (row: PassRequestItem) => {
    setActingId(row.requestId)
    try {
      await rejectPassRequest(row.requestId, rejectReason.trim() || undefined)
      markDecided(row.requestId)
      setRejectingId(null)
      setRejectReason('')
      notify(`${row.applicantName} 님 신청을 거절했습니다.`, 'info')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ALREADY_DECIDED') {
        markDecided(row.requestId)
      }
      notify(
        err instanceof ApiError ? err.message : '거절에 실패했습니다.',
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
          <T.PageTitle>이용권 신청</T.PageTitle>
          <T.PageSub>{rows.length}건 대기 중</T.PageSub>
        </div>
      </T.PageHeader>

      {rows.length > 0 ? (
        <T.TableCard>
          <T.TableInner style={{ minWidth: MIN_WIDTH }}>
            <T.HeadRow style={{ gridTemplateColumns: COLS }}>
              <T.HeadCell>신청자</T.HeadCell>
              <T.HeadCell>연락처</T.HeadCell>
              <T.HeadCell>좌석</T.HeadCell>
              <T.HeadCell>IP</T.HeadCell>
              <T.HeadCell>신청 시각</T.HeadCell>
              <T.HeadCell>사유</T.HeadCell>
              <T.HeadCell />
            </T.HeadRow>
            {rows.map((row) => (
              <T.BodyRow key={row.requestId}>
                <T.RowGrid style={{ gridTemplateColumns: COLS }}>
                  <T.Cell data-variant='strong'>{row.applicantName}</T.Cell>
                  <T.Cell>{row.phone}</T.Cell>
                  <T.Cell data-variant='strong'>{row.seat ?? '-'}</T.Cell>
                  <T.Cell data-variant='faint'>{row.ip ?? '-'}</T.Cell>
                  <T.Cell data-variant='faint'>
                    {formatShort(row.createdAt)}
                  </T.Cell>
                  <T.Cell data-variant='ellipsis'>{row.reason ?? '-'}</T.Cell>
                  <T.Cell data-variant='actions'>
                    <S.Actions>
                      <T.SolidButton
                        type='button'
                        onClick={() => handleApproveStart(row)}
                        disabled={actingId !== null}
                      >
                        승인
                      </T.SolidButton>
                      <T.GhostButton
                        type='button'
                        onClick={() => handleRejectStart(row)}
                        disabled={actingId !== null}
                      >
                        거절
                      </T.GhostButton>
                    </S.Actions>
                  </T.Cell>
                </T.RowGrid>
                {approvingId === row.requestId && (
                  <T.InlineForm>
                    {PASS_TYPE_OPTIONS.map((option) => (
                      <T.Chip
                        key={option.value}
                        type='button'
                        data-active={approveType === option.value}
                        onClick={() => setApproveType(option.value)}
                        disabled={actingId !== null}
                      >
                        {option.label}
                      </T.Chip>
                    ))}
                    <T.SolidButton
                      type='button'
                      onClick={() => handleApprove(row)}
                      disabled={actingId !== null || approveType === null}
                    >
                      승인 확정
                    </T.SolidButton>
                    <T.QuietButton
                      type='button'
                      onClick={() => setApprovingId(null)}
                    >
                      취소
                    </T.QuietButton>
                  </T.InlineForm>
                )}
                {rejectingId === row.requestId && (
                  <T.InlineForm>
                    <T.InlineInput
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      placeholder='거절 사유 (선택)'
                      aria-label='거절 사유'
                    />
                    <T.SolidButton
                      type='button'
                      data-tone='danger'
                      onClick={() => handleReject(row)}
                      disabled={actingId !== null}
                    >
                      거절 확정
                    </T.SolidButton>
                    <T.QuietButton
                      type='button'
                      onClick={() => setRejectingId(null)}
                    >
                      취소
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
            ? '신청 목록을 불러오지 못했습니다.'
            : '대기 중인 신청이 없습니다.'}
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
