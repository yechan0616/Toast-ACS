'use client'

import type {
  AnyErrorCode,
  PassRequestStatus,
  PassSummary,
  PassType,
} from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { fadeUp } from '@toast-acs/ui'
import { BottomCta } from 'components/BottomCta/BottomCta.index'
import { requestEntry } from 'features/entry/api'
import { denialMessage, needsReauth } from 'features/entry/denialMessage'
import { formatDateTime } from 'features/entry/formatDateTime'
import type { EntryFeedback } from 'features/entry/types'
import { activatePass, fetchMe } from 'features/pass/api'
import {
  getRecentPass,
  markRecentPassExpired,
  saveRecentPass,
} from 'features/pass/recentPassStorage'
import {
  clearStoredRequestId,
  getStoredRequestId,
} from 'features/pass/requestStorage'
import { usePassRequestStatus } from 'features/pass/usePassRequestStatus'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import * as S from './HomeScreen.styled'

const REQUEST_SUB: Record<PassRequestStatus, string> = {
  PENDING: '요청을 확인하고 있어요. 수락되면 여기서 알려드릴게요.',
  APPROVED: '요청이 수락됐어요. 이어서 등록을 진행해 주세요.',
  REJECTED: '요청이 거절됐어요. 내용을 확인해 주세요.',
}

const PASS_DEAD_CODES = new Set<AnyErrorCode>([
  'PASS_EXPIRED',
  'PASS_REVOKED',
  'PASS_NOT_FOUND',
  'DEVICE_MISMATCH',
])

const isPassDead = (code: AnyErrorCode) => PASS_DEAD_CODES.has(code)

const PASS_TYPE_LABEL: Record<PassType, string> = {
  TIME: '시간권',
  PERIOD: '기간권',
}

const expiryLine = (expiresAt: string, passType?: PassType) =>
  `${passType ? `${PASS_TYPE_LABEL[passType]} · ` : ''}${formatDateTime(expiresAt)} 만료`

const extractRevokeReason = (message: string) =>
  message.replace(/^[\s\S]*?사유:\s*/, '').trim()

const KEEPALIVE_MS = 25000

export function HomeScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<PassSummary | null>(null)
  const [feedback, setFeedback] = useState<EntryFeedback | null>(null)
  const [pending, setPending] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(() =>
    getStoredRequestId(),
  )
  const [recentPass, setRecentPass] = useState(() => getRecentPass())

  const requestState = usePassRequestStatus(
    loading || summary ? null : requestId,
    () => {
      clearStoredRequestId()
      setRequestId(null)
    },
  )

  const applySummary = useCallback((me: PassSummary) => {
    setSummary(me)
    const recent = getRecentPass()
    if (recent) {
      const enriched = {
        ...recent,
        serviceName: me.serviceName,
        gateName: me.gateName,
        passType: me.passType,
        expiresAt: me.expiresAt,
        expired: false,
      }
      saveRecentPass(enriched)
      setRecentPass(enriched)
    }
  }, [])

  const recoverSession = useCallback(async (): Promise<PassSummary | null> => {
    const recent = getRecentPass()
    if (!recent || recent.expired) return null
    try {
      await activatePass(recent.code)
      const me = await fetchMe()
      applySummary(me)
      return me
    } catch (error) {
      if (error instanceof ApiError && isPassDead(error.code)) {
        setSummary(null)
        setRecentPass(
          markRecentPassExpired(
            error.code === 'PASS_REVOKED'
              ? extractRevokeReason(error.message)
              : undefined,
          ),
        )
      }
      return null
    }
  }, [applySummary])

  useEffect(() => {
    const controller = new AbortController()
    fetchMe(controller.signal)
      .then(applySummary)
      .catch(async () => {
        if (controller.signal.aborted) return
        setSummary(null)
        await recoverSession()
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [applySummary, recoverSession])

  const hasSummary = summary !== null

  useEffect(() => {
    if (!hasSummary) return
    let active = true

    const refresh = async () => {
      try {
        const me = await fetchMe()
        if (active) applySummary(me)
      } catch (error) {
        if (!active) return
        if (error instanceof ApiError && needsReauth(error.code)) {
          setSummary(null)
          void recoverSession()
        }
      }
    }

    const id = setInterval(refresh, KEEPALIVE_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      active = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [hasSummary, applySummary, recoverSession])

  const runEntry = async (base: PassSummary) => {
    const direction = base.inside ? 'OUT' : 'IN'
    await requestEntry(direction)
    setFeedback({
      allowed: true,
      message: direction === 'IN' ? '게이트가 열렸어요.' : '퇴장을 완료했어요.',
    })
    setSummary({
      ...base,
      inside: !base.inside,
      entryCount: base.entryCount + 1,
    })
  }

  const showEntryError = (error: unknown, inside: boolean) => {
    if (error instanceof ApiError) {
      const message =
        error.code === 'NO_PRESENCE'
          ? `게이트 앞으로 이동하면 ${inside ? '퇴장' : '입장'}할 수 있어요.`
          : denialMessage(error.code, error.message)
      setFeedback({ allowed: false, code: error.code, message })
    } else {
      setFeedback({
        allowed: false,
        message: '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
      })
    }
  }

  const handleEntry = async () => {
    if (!summary || pending) return
    setPending(true)
    setFeedback(null)
    try {
      await runEntry(summary)
    } catch (error) {
      if (error instanceof ApiError && needsReauth(error.code)) {
        const restored = await recoverSession()
        if (restored) {
          try {
            await runEntry(restored)
          } catch (retryError) {
            showEntryError(retryError, restored.inside)
          }
        } else {
          showEntryError(error, summary.inside)
        }
      } else {
        showEntryError(error, summary.inside)
      }
    } finally {
      setPending(false)
    }
  }

  const handleReactivate = async () => {
    if (!recentPass || pending) return
    setPending(true)
    setFeedback(null)
    try {
      await activatePass(recentPass.code)
      const me = await fetchMe()
      setSummary(me)
    } catch (error) {
      if (error instanceof ApiError) {
        if (isPassDead(error.code)) {
          setRecentPass(
            markRecentPassExpired(
              error.code === 'PASS_REVOKED' ? error.message : undefined,
            ),
          )
        } else {
          setFeedback({
            allowed: false,
            code: error.code,
            message: error.message,
          })
        }
      } else {
        setFeedback({
          allowed: false,
          message: '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
        })
      }
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return (
      <S.Main>
        <S.Loading>불러오는 중…</S.Loading>
      </S.Main>
    )
  }

  const requestStatus = summary
    ? null
    : requestId
      ? (requestState?.status ?? 'PENDING')
      : null

  const showRecent = !summary && !requestStatus && recentPass !== null
  const recentExpired =
    recentPass !== null &&
    (recentPass.expired === true ||
      new Date(recentPass.expiresAt).getTime() <= Date.now())

  const sub = summary
    ? summary.inside
      ? '나갈 때도 게이트 앞에서 퇴장하기 버튼을 눌러 주세요.'
      : '게이트 앞에서 입장하기 버튼을 눌러 주세요.'
    : requestStatus
      ? REQUEST_SUB[requestStatus]
      : showRecent
        ? recentExpired
          ? '인증이 만료됐어요. 서비스 이용이 불가능해요.'
          : '인증이 만료됐어요. 최근 출입증으로 다시 등록할 수 있어요.'
        : '아직 이용 중인 서비스가 없어요.'

  return (
    <S.Main>
      <S.Content variants={fadeUp} initial='hidden' animate='visible'>
        <S.Head>
          <S.Title>Toast ACS</S.Title>
          <S.Sub>{sub}</S.Sub>
        </S.Head>
        {summary && (
          <S.ServiceCard>
            <S.CardService>{summary.serviceName}</S.CardService>
            <S.CardGate>{summary.gateName}</S.CardGate>
            <S.CardExpiry>
              {expiryLine(summary.expiresAt, summary.passType)}
            </S.CardExpiry>
            <S.CardCount>누적 출입 {summary.entryCount}회</S.CardCount>
          </S.ServiceCard>
        )}
        {showRecent && recentPass && (
          <S.ServiceCard data-expired={recentExpired ? 'true' : 'false'}>
            <S.CardService>
              {recentPass.serviceName ?? '최근 출입증'}
            </S.CardService>
            {recentPass.gateName && (
              <S.CardGate>{recentPass.gateName}</S.CardGate>
            )}
            <S.CardExpiry>
              {expiryLine(recentPass.expiresAt, recentPass.passType)}
            </S.CardExpiry>
          </S.ServiceCard>
        )}
        {showRecent && recentExpired && recentPass?.expiredReason && (
          <S.RevokeNotice>
            <S.RevokeLabel>관리자 취소 사유</S.RevokeLabel>
            <S.RevokeText>{recentPass.expiredReason}</S.RevokeText>
          </S.RevokeNotice>
        )}
        {feedback && (
          <S.Feedback data-allowed={feedback.allowed ? 'true' : 'false'}>
            {feedback.message}
          </S.Feedback>
        )}
      </S.Content>
      {summary && (
        <BottomCta
          label={summary.inside ? '퇴장하기' : '입장하기'}
          disabled={pending}
          onClick={handleEntry}
        />
      )}
      {!summary && requestStatus === 'PENDING' && (
        <BottomCta
          label='승인 대기 중…'
          disabled
          helper={{
            question: '인증번호를 받았나요?',
            linkLabel: '서비스 등록',
            href: '/register',
          }}
        />
      )}
      {!summary && requestStatus === 'APPROVED' && (
        <BottomCta
          label='등록 진행하기'
          onClick={() => router.push('/request')}
        />
      )}
      {!summary && requestStatus === 'REJECTED' && (
        <BottomCta
          label='요청 확인하기'
          onClick={() => router.push('/request')}
        />
      )}
      {showRecent && !recentExpired && (
        <BottomCta
          label={pending ? '등록 중…' : '다시 등록하기'}
          disabled={pending}
          onClick={handleReactivate}
          helper={{
            question: '다른 인증번호가 있나요?',
            linkLabel: '서비스 등록',
            href: '/register',
          }}
        />
      )}
      {showRecent && recentExpired && (
        <BottomCta
          label='서비스 요청하기'
          onClick={() => router.push('/request')}
          helper={{
            question: '인증번호를 받았나요?',
            linkLabel: '서비스 등록',
            href: '/register',
          }}
        />
      )}
      {!summary && !requestStatus && !recentPass && (
        <BottomCta
          label='서비스 등록'
          onClick={() => router.push('/register')}
        />
      )}
    </S.Main>
  )
}
