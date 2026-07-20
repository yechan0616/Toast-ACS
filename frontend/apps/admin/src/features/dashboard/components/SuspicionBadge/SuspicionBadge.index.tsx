'use client'

import type { SuspectedPass } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { Badge, Button, TextField } from '@toast-acs/ui'
import { revokePass } from 'features/dashboard/api'
import { useState } from 'react'
import * as S from './SuspicionBadge.styled'

const REVOKED_VISIBLE_MS = 5000

export function SuspicionBadge({ passes }: { passes: SuspectedPass[] }) {
  const [confirmingCode, setConfirmingCode] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [acting, setActing] = useState(false)
  const [revokedCodes, setRevokedCodes] = useState<string[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [revokedNotice, setRevokedNotice] = useState<string | null>(null)

  const visible = passes.filter((pass) => !revokedCodes.includes(pass.code))
  const suspected = visible.length > 0

  const handleRevokeStart = (pass: SuspectedPass) => {
    setConfirmingCode(pass.code)
    setReason('')
    setNotice(null)
  }

  const handleRevoke = async (pass: SuspectedPass) => {
    const trimmed = reason.trim()
    if (!trimmed) return
    setActing(true)
    setNotice(null)
    try {
      await revokePass(pass.code, trimmed)
      setRevokedCodes((prev) => [...prev, pass.code])
      setConfirmingCode(null)
      setReason('')
      setRevokedNotice(`발급 코드 ${pass.code}를 취소했어요.`)
      setTimeout(() => {
        setRevokedNotice(null)
      }, REVOKED_VISIBLE_MS)
    } catch (err) {
      setNotice(
        err instanceof ApiError ? err.message : '강제 취소에 실패했어요.',
      )
    } finally {
      setActing(false)
    }
  }

  return (
    <S.Root>
      <Badge tone={suspected ? 'danger' : 'success'}>
        {suspected ? '공유 의심' : '이상 없음'}
      </Badge>
      {notice && <S.Notice>{notice}</S.Notice>}
      {revokedNotice && <S.RevokedNotice>{revokedNotice}</S.RevokedNotice>}
      {suspected && (
        <S.List>
          {visible.map((pass) => (
            <S.Item key={pass.code}>
              <S.Row>
                <S.Count>
                  {pass.code} · 기기 교체 {pass.kills}회
                </S.Count>
                <Button
                  design='line'
                  size='tiny'
                  onClick={() => handleRevokeStart(pass)}
                  disabled={acting || confirmingCode === pass.code}
                >
                  강제 취소
                </Button>
              </S.Row>
              {confirmingCode === pass.code && (
                <S.RevokeForm>
                  <TextField
                    size='small'
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder='취소 사유 (필수)'
                    aria-label='취소 사유'
                  />
                  <Button
                    design='danger'
                    size='small'
                    onClick={() => handleRevoke(pass)}
                    disabled={acting || reason.trim() === ''}
                  >
                    취소 확정
                  </Button>
                  <Button
                    design='gray'
                    size='small'
                    onClick={() => setConfirmingCode(null)}
                    disabled={acting}
                  >
                    닫기
                  </Button>
                </S.RevokeForm>
              )}
            </S.Item>
          ))}
        </S.List>
      )}
    </S.Root>
  )
}
