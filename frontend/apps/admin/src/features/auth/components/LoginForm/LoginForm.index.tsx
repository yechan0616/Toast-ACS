'use client'

import { ApiError } from '@toast-acs/shared'
import {
  Button,
  fadeUp,
  fadeUpSoft,
  staggerSlow,
  TextField,
} from '@toast-acs/ui'
import { adminLogin } from 'features/auth/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useState } from 'react'
import * as S from './LoginForm.styled'

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      await adminLogin({ username, password })
      router.replace('/')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'INVALID_CREDENTIALS') {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.')
      } else {
        setError(
          err instanceof ApiError ? err.message : '로그인에 실패했습니다.',
        )
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <S.Main>
      <S.Brand>
        <S.Wordmark>
          <S.Glyph>
            <Image src='/brand/gf_white.png' alt='' width={26} height={26} />
          </S.Glyph>
          Toast ACS
        </S.Wordmark>
        <S.BrandCopy variants={staggerSlow} initial='hidden' animate='visible'>
          <S.Tagline variants={fadeUpSoft}>
            출입의 모든 순간을
            <br />
            기록하고 감지합니다
          </S.Tagline>
          <S.TaglineSub variants={fadeUpSoft}>
            게이트 상태, 이용권, 이상 징후를 하나의 콘솔에서 관리하세요.
          </S.TaglineSub>
        </S.BrandCopy>
      </S.Brand>

      <S.Panel>
        <S.Card variants={staggerSlow} initial='hidden' animate='visible'>
          <S.Reveal variants={fadeUpSoft}>
            <S.Brandmark>
              <Image src='/brand/gf_color.png' alt='' width={34} height={34} />
              Toast ACS
            </S.Brandmark>
          </S.Reveal>
          <S.Reveal variants={fadeUpSoft}>
            <S.Head>
              <S.Title>관리자 로그인</S.Title>
              <S.Subtitle>인증 관리 콘솔에 접속합니다</S.Subtitle>
            </S.Head>
          </S.Reveal>
          <S.Form onSubmit={handleSubmit}>
            <S.Reveal variants={fadeUpSoft}>
              <TextField
                label='아이디'
                size='large'
                variant='underline'
                name='username'
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setError(null)
                }}
                autoComplete='username'
                autoFocus
                required
              />
            </S.Reveal>
            <S.Reveal variants={fadeUpSoft}>
              <TextField
                label='비밀번호'
                size='large'
                variant='underline'
                type='password'
                name='password'
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError(null)
                }}
                autoComplete='current-password'
                required
              />
            </S.Reveal>
            <S.Reveal variants={fadeUpSoft}>
              <S.Action>
                <Button type='submit' size='large' full disabled={pending}>
                  {pending ? '확인 중…' : '로그인'}
                </Button>
              </S.Action>
            </S.Reveal>
            {error && (
              <S.ErrorText
                role='alert'
                variants={fadeUp}
                initial='hidden'
                animate='visible'
              >
                {error}
              </S.ErrorText>
            )}
          </S.Form>
          <S.Reveal variants={fadeUpSoft}>
            <S.Footer>관리자 전용 콘솔 · All access is logged</S.Footer>
          </S.Reveal>
        </S.Card>
      </S.Panel>
    </S.Main>
  )
}
