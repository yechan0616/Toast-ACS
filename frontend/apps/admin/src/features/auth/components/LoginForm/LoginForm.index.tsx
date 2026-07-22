'use client'

import { ApiError } from '@toast-acs/shared'
import { adminLogin } from 'features/auth/api'
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
        setError('아이디 또는 비밀번호를 다시 확인해 주세요.')
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.',
        )
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <S.Main>
      <S.Card>
        <S.Header>
          <S.Brand>
            <S.BrandName>Toast ACS</S.BrandName>
          </S.Brand>
          <S.Console>Admin Console</S.Console>
        </S.Header>
        <S.Form onSubmit={handleSubmit}>
          <S.Field>
            <S.Label htmlFor='admin-username'>아이디</S.Label>
            <S.Input
              id='admin-username'
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
          </S.Field>
          <S.Field>
            <S.Label htmlFor='admin-password'>비밀번호</S.Label>
            <S.Input
              id='admin-password'
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
          </S.Field>
          {error && <S.ErrorText role='alert'>{error}</S.ErrorText>}
          <S.Submit type='submit' disabled={pending}>
            {pending ? '확인 중…' : '로그인'}
          </S.Submit>
        </S.Form>
        <S.Footer>
          <S.Note>모든 접속이 기록됩니다</S.Note>
          <S.Version>v2.4.1</S.Version>
        </S.Footer>
      </S.Card>
    </S.Main>
  )
}
