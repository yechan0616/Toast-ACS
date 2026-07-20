'use client'

import type { SessionItem } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { Button, SectionTitle, Table, Td, TextField, Th } from '@toast-acs/ui'
import { fetchSessions, revokePass } from 'features/dashboard/api'
import { formatTime } from 'features/logs/alertLabels'
import { Fragment, useCallback, useState } from 'react'
import { useLoadMore } from 'shared/useLoadMore'
import { usePolling } from 'shared/usePolling'
import * as S from './DeviceSessions.styled'

const POLL_MS = 3000
const REVOKED_VISIBLE_MS = 5000

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

  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [revokeReason, setRevokeReason] = useState('')
  const [actingId, setActingId] = useState<number | null>(null)
  const [revokedCodes, setRevokedCodes] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [revokedNotice, setRevokedNotice] = useState<string | null>(null)

  const rows = pagedRows.filter((row) => !revokedCodes.includes(row.passCode))

  const handleRevokeStart = (row: SessionItem) => {
    setConfirmingId(row.id)
    setRevokeReason('')
  }

  const handleRevoke = async (row: SessionItem) => {
    const reason = revokeReason.trim()
    if (!reason) return
    setActingId(row.id)
    setNotice(null)
    try {
      await revokePass(row.passCode, reason)
      setRevokedCodes((prev) => [...prev, row.passCode])
      setConfirmingId(null)
      setRevokeReason('')
      setRevokedNotice(`발급 코드 ${row.passCode}를 취소했어요.`)
      setTimeout(() => {
        setRevokedNotice(null)
      }, REVOKED_VISIBLE_MS)
    } catch (err) {
      setNotice(
        err instanceof ApiError ? err.message : '강제 취소에 실패했어요.',
      )
    } finally {
      setActingId(null)
    }
  }

  return (
    <S.Section>
      <SectionTitle>활성 기기</SectionTitle>
      {notice && <S.Notice>{notice}</S.Notice>}
      {revokedNotice && <S.RevokedNotice>{revokedNotice}</S.RevokedNotice>}
      {rows.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>이용권 코드</Th>
              <Th>기기</Th>
              <Th>출입</Th>
              <Th>등록 시각</Th>
              <Th>처리</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  <Td>{row.passCode}</Td>
                  <S.DeviceTd title={row.userAgent}>{row.userAgent}</S.DeviceTd>
                  <Td>{row.entryCount}회</Td>
                  <Td>{formatTime(row.createdAt)}</Td>
                  <Td>
                    <Button
                      design='line'
                      size='tiny'
                      onClick={() => handleRevokeStart(row)}
                      disabled={actingId !== null || confirmingId === row.id}
                    >
                      강제 취소
                    </Button>
                  </Td>
                </tr>
                {confirmingId === row.id && (
                  <tr>
                    <S.FormTd colSpan={5}>
                      <S.RevokeForm>
                        <TextField
                          size='small'
                          value={revokeReason}
                          onChange={(event) =>
                            setRevokeReason(event.target.value)
                          }
                          placeholder='취소 사유 (필수)'
                          aria-label='취소 사유'
                        />
                        <Button
                          design='danger'
                          size='small'
                          onClick={() => handleRevoke(row)}
                          disabled={
                            actingId !== null || revokeReason.trim() === ''
                          }
                        >
                          취소 확정
                        </Button>
                        <Button
                          design='gray'
                          size='small'
                          onClick={() => setConfirmingId(null)}
                          disabled={actingId !== null}
                        >
                          닫기
                        </Button>
                      </S.RevokeForm>
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
            ? '활성 기기를 불러오지 못했습니다.'
            : '활성 기기가 없습니다.'}
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
