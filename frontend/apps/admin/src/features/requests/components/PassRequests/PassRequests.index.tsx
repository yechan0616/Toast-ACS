'use client'

import type { PassRequestItem, PassType } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { Button, SectionTitle, Table, Td, TextField, Th } from '@toast-acs/ui'
import { formatTime } from 'features/logs/alertLabels'
import {
  approvePassRequest,
  fetchPassRequests,
  rejectPassRequest,
} from 'features/requests/api'
import { Fragment, useCallback, useState } from 'react'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './PassRequests.styled'

const POLL_MS = 3000
const ISSUED_VISIBLE_MS = 10000

const PASS_TYPE_OPTIONS: { value: PassType; label: string }[] = [
  { value: 'TIME', label: '시간권 · 24시간' },
  { value: 'PERIOD', label: '기간권 · 30일' },
]

interface IssuedNotice {
  requestId: string
  applicantName: string
  code: string
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

  const [actingId, setActingId] = useState<string | null>(null)
  const [decidedIds, setDecidedIds] = useState<string[]>([])
  const [issued, setIssued] = useState<IssuedNotice[]>([])
  const [notice, setNotice] = useState<string | null>(null)
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
    setNotice(null)
    try {
      const result = await approvePassRequest(row.requestId, approveType)
      markDecided(row.requestId)
      setApprovingId(null)
      setApproveType(null)
      setIssued((prev) => [
        ...prev,
        {
          requestId: row.requestId,
          applicantName: row.applicantName,
          code: result.code,
        },
      ])
      setTimeout(() => {
        setIssued((prev) =>
          prev.filter((item) => item.requestId !== row.requestId),
        )
      }, ISSUED_VISIBLE_MS)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ALREADY_DECIDED') {
        markDecided(row.requestId)
      }
      setNotice(err instanceof ApiError ? err.message : '승인에 실패했습니다.')
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
    setNotice(null)
    try {
      await rejectPassRequest(row.requestId, rejectReason.trim() || undefined)
      markDecided(row.requestId)
      setRejectingId(null)
      setRejectReason('')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ALREADY_DECIDED') {
        markDecided(row.requestId)
      }
      setNotice(err instanceof ApiError ? err.message : '거절에 실패했습니다.')
    } finally {
      setActingId(null)
    }
  }

  return (
    <S.Section>
      <SectionTitle>이용권 신청</SectionTitle>
      {notice && <S.Notice>{notice}</S.Notice>}
      {issued.length > 0 && (
        <S.IssuedList>
          {issued.map((item) => (
            <S.IssuedItem key={item.requestId}>
              {item.applicantName} 님 승인 완료 — 발급 코드{' '}
              <S.IssuedCode>{item.code}</S.IssuedCode>
            </S.IssuedItem>
          ))}
        </S.IssuedList>
      )}
      {rows.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>신청자</Th>
              <Th>연락처</Th>
              <Th>좌석</Th>
              <Th>IP</Th>
              <Th>신청 시각</Th>
              <Th>처리</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.requestId}>
                <tr>
                  <S.NameTd>{row.applicantName}</S.NameTd>
                  <Td>{row.phone}</Td>
                  <Td>{row.seat ?? '-'}</Td>
                  <Td>{row.ip ?? '-'}</Td>
                  <Td>{formatTime(row.createdAt)}</Td>
                  <Td>
                    <S.Actions>
                      <Button
                        size='tiny'
                        onClick={() => handleApproveStart(row)}
                        disabled={actingId !== null}
                      >
                        승인
                      </Button>
                      <Button
                        design='line'
                        size='tiny'
                        onClick={() => handleRejectStart(row)}
                        disabled={actingId !== null}
                      >
                        거절
                      </Button>
                    </S.Actions>
                  </Td>
                </tr>
                {row.reason && (
                  <tr>
                    <S.ReasonTd colSpan={6}>신청 사유: {row.reason}</S.ReasonTd>
                  </tr>
                )}
                {approvingId === row.requestId && (
                  <tr>
                    <S.FormTd colSpan={6}>
                      <S.ApproveForm>
                        <S.TypeOptions>
                          {PASS_TYPE_OPTIONS.map((option) => (
                            <Button
                              key={option.value}
                              design={
                                approveType === option.value ? 'brand' : 'line'
                              }
                              size='small'
                              aria-pressed={approveType === option.value}
                              onClick={() => setApproveType(option.value)}
                              disabled={actingId !== null}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </S.TypeOptions>
                        <Button
                          size='small'
                          onClick={() => handleApprove(row)}
                          disabled={actingId !== null || approveType === null}
                        >
                          승인 확정
                        </Button>
                        <Button
                          design='gray'
                          size='small'
                          onClick={() => setApprovingId(null)}
                        >
                          취소
                        </Button>
                      </S.ApproveForm>
                    </S.FormTd>
                  </tr>
                )}
                {rejectingId === row.requestId && (
                  <tr>
                    <S.FormTd colSpan={6}>
                      <S.RejectForm>
                        <TextField
                          size='small'
                          value={rejectReason}
                          onChange={(event) =>
                            setRejectReason(event.target.value)
                          }
                          placeholder='거절 사유 (선택)'
                          aria-label='거절 사유'
                        />
                        <Button
                          design='danger'
                          size='small'
                          onClick={() => handleReject(row)}
                          disabled={actingId !== null}
                        >
                          거절 확정
                        </Button>
                        <Button
                          design='gray'
                          size='small'
                          onClick={() => setRejectingId(null)}
                        >
                          취소
                        </Button>
                      </S.RejectForm>
                    </S.FormTd>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </Table>
      ) : (
        <S.Empty>
          {error && !data
            ? '신청 목록을 불러오지 못했습니다.'
            : '대기 중인 신청이 없습니다.'}
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
