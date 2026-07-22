'use client'

import type { SeatStatus } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { fadeUp } from '@toast-acs/ui'
import { BackHeader } from 'components/BackHeader/BackHeader.index'
import { BottomCta } from 'components/BottomCta/BottomCta.index'
import { UnderlineField } from 'components/UnderlineField/UnderlineField.index'
import { activatePass, createPassRequest, fetchSeats } from 'features/pass/api'
import { formatPhone } from 'features/pass/formatPhone'
import { saveRecentPass } from 'features/pass/recentPassStorage'
import {
  clearStoredRequestId,
  getStoredRequestId,
  storeRequestId,
} from 'features/pass/requestStorage'
import { usePassRequestStatus } from 'features/pass/usePassRequestStatus'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import * as S from './RequestScreen.styled'

const STEP_TITLES = [
  '이름을 입력해주세요',
  '연락처를 입력해주세요',
  '사유를 입력해주세요',
  '좌석을 선택해주세요',
]

const SEAT_STEP = 3

const REGISTER_HELPER = {
  question: '인증번호를 받았나요?',
  linkLabel: '서비스 등록',
  href: '/register',
}

export function RequestScreen() {
  const router = useRouter()
  const [requestId, setRequestId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [seat, setSeat] = useState<string | null>(null)
  const [seats, setSeats] = useState<SeatStatus[] | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  useEffect(() => {
    setRequestId(getStoredRequestId())
  }, [])

  useEffect(() => {
    if (step !== SEAT_STEP) return
    const controller = new AbortController()
    fetchSeats(controller.signal)
      .then(setSeats)
      .catch(() => {})
    return () => controller.abort()
  }, [step])

  const state = usePassRequestStatus(requestId, () => {
    clearStoredRequestId()
    setRequestId(null)
  })

  const stepFilled = [
    name.trim().length > 0,
    phone.replace(/\D/g, '').length >= 10,
    reason.trim().length > 0,
    seat !== null,
  ][step]

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!stepFilled || pending) return
    if (step < SEAT_STEP) {
      setStep(step + 1)
      return
    }
    if (!seat) return

    setPending(true)
    setError(null)
    try {
      const created = await createPassRequest({
        applicantName: name.trim(),
        phone,
        seat,
        reason: reason.trim(),
      })
      storeRequestId(created.requestId)
      setRequestId(created.requestId)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'SEAT_TAKEN') {
        setSeat(null)
        fetchSeats()
          .then(setSeats)
          .catch(() => {})
      }
      setError(
        err instanceof ApiError
          ? err.message
          : '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setPending(false)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
      return
    }
    router.back()
  }

  const handleRegister = async () => {
    if (!state?.code || registering) return
    setRegistering(true)
    setRegisterError(null)
    try {
      const result = await activatePass(state.code)
      saveRecentPass({
        code: state.code,
        expiresAt: result.expiresAt,
        passType: result.passType,
        seat: result.seat,
      })
      clearStoredRequestId()
      router.replace('/')
    } catch (err) {
      setRegisterError(
        err instanceof ApiError
          ? err.message
          : '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
      )
      setRegistering(false)
    }
  }

  const handleRetry = () => {
    clearStoredRequestId()
    setRequestId(null)
    setStep(0)
    setReason('')
    setSeat(null)
    setSeats(null)
  }

  if (requestId) {
    const status = state?.status ?? 'PENDING'
    return (
      <S.Main>
        <BackHeader onBack={() => router.back()} />
        <AnimatePresence mode='wait'>
          <S.Status
            key={status}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            exit='hidden'
          >
            {status === 'PENDING' && (
              <>
                <S.Title>요청을 확인하고 있어요</S.Title>
                <S.Sub>관리자가 승인하면 인증코드를 알려드릴게요.</S.Sub>
              </>
            )}
            {status === 'APPROVED' && (
              <>
                <S.Title>인증코드가 발급됐어요</S.Title>
                <S.Sub>
                  {state?.seat ? `좌석 ${state.seat} · ` : ''}이 기기에서만
                  등록할 수 있는 코드예요.
                </S.Sub>
                <UnderlineField
                  value={state?.code ?? ''}
                  disabled
                  aria-label='발급된 인증코드'
                  error={registerError}
                />
              </>
            )}
            {status === 'REJECTED' && (
              <>
                <S.Title>요청이 거절됐어요</S.Title>
                <S.Sub>
                  {state?.rejectReason ??
                    '관리자에게 문의하거나 다시 요청해 주세요.'}
                </S.Sub>
              </>
            )}
          </S.Status>
        </AnimatePresence>
        {status === 'PENDING' && (
          <BottomCta label='승인 대기 중…' disabled helper={REGISTER_HELPER} />
        )}
        {status === 'APPROVED' && (
          <BottomCta
            label={registering ? '등록 중…' : '등록하기'}
            disabled={registering}
            onClick={handleRegister}
          />
        )}
        {status === 'REJECTED' && (
          <BottomCta label='다시 요청하기' onClick={handleRetry} />
        )}
      </S.Main>
    )
  }

  return (
    <S.Main>
      <BackHeader onBack={handleBack} />
      <S.Form onSubmit={handleSubmit}>
        <AnimatePresence mode='wait'>
          <S.TitleSlot
            key={step}
            variants={fadeUp}
            initial='hidden'
            animate='visible'
            exit='hidden'
          >
            <S.Title>{STEP_TITLES[step]}</S.Title>
          </S.TitleSlot>
        </AnimatePresence>
        <S.Fields>
          <UnderlineField
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='이름'
            autoComplete='name'
            autoFocus={step === 0}
          />
          {step >= 1 && (
            <UnderlineField
              type='tel'
              inputMode='numeric'
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              placeholder='전화번호'
              autoComplete='tel'
              autoFocus={step === 1}
            />
          )}
          {step >= 2 && (
            <UnderlineField
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder='출입 목적'
              autoComplete='off'
              autoFocus={step === 2}
            />
          )}
          {step >= SEAT_STEP && (
            <S.SeatSection>
              <S.SeatStage>GROUND</S.SeatStage>
              {seats === null ? (
                <S.SeatLoading>좌석을 불러오는 중…</S.SeatLoading>
              ) : (
                <S.SeatGrid aria-label='좌석 선택'>
                  {seats.map((item) => (
                    <S.SeatButton
                      key={item.seat}
                      type='button'
                      disabled={item.taken}
                      data-selected={seat === item.seat ? 'true' : 'false'}
                      aria-pressed={seat === item.seat}
                      onClick={() => setSeat(item.seat)}
                    >
                      {item.seat}
                    </S.SeatButton>
                  ))}
                </S.SeatGrid>
              )}
              <S.SeatLegend>
                <S.LegendItem>
                  <S.LegendDot data-kind='free' /> 선택 가능
                </S.LegendItem>
                <S.LegendItem>
                  <S.LegendDot data-kind='taken' /> 예약됨
                </S.LegendItem>
                <S.LegendItem>
                  <S.LegendDot data-kind='selected' /> 내 좌석
                </S.LegendItem>
              </S.SeatLegend>
              {error && <S.SeatError>{error}</S.SeatError>}
            </S.SeatSection>
          )}
        </S.Fields>
        <BottomCta
          type='submit'
          label={step < SEAT_STEP ? '다음' : pending ? '제출 중…' : '제출'}
          disabled={!stepFilled || pending}
          helper={REGISTER_HELPER}
        />
      </S.Form>
    </S.Main>
  )
}
