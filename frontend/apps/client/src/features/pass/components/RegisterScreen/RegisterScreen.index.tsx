'use client'

import { ApiError } from '@toast-acs/shared'
import { fadeUp } from '@toast-acs/ui'
import { BackHeader } from 'components/BackHeader/BackHeader.index'
import { BottomCta } from 'components/BottomCta/BottomCta.index'
import { UnderlineField } from 'components/UnderlineField/UnderlineField.index'
import { activatePass } from 'features/pass/api'
import { saveRecentPass } from 'features/pass/recentPassStorage'
import { useRouter } from 'next/navigation'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import * as S from './RegisterScreen.styled'

export function RegisterScreen() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = code.trim()
    if (!trimmed || pending) return

    setPending(true)
    setError(null)
    try {
      const result = await activatePass(trimmed)
      saveRecentPass({
        code: trimmed,
        expiresAt: result.expiresAt,
        passType: result.passType,
        seat: result.seat,
      })
      router.replace('/')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : '일시적인 오류가 있어요. 잠시 후 다시 시도해 주세요.',
      )
      setPending(false)
    }
  }

  return (
    <S.Main>
      <BackHeader onBack={() => router.back()} />
      <S.Form onSubmit={handleSubmit}>
        <S.Content variants={fadeUp} initial='hidden' animate='visible'>
          <S.Title>서비스 등록</S.Title>
          <UnderlineField
            value={code}
            onChange={handleChange}
            placeholder='안내받은 인증코드를 입력하세요'
            autoComplete='off'
            autoCapitalize='characters'
            autoFocus
            error={error}
          />
        </S.Content>
        <BottomCta
          type='submit'
          label={pending ? '등록 중…' : '등록하기'}
          disabled={!code.trim() || pending}
          helper={{
            question: '재발급이 필요한가요?',
            linkLabel: '서비스 요청',
            href: '/request',
          }}
        />
      </S.Form>
    </S.Main>
  )
}
