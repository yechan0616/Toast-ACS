'use client'

import type { InputHTMLAttributes } from 'react'
import * as S from './UnderlineField.styled'

interface UnderlineFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | null
}

export function UnderlineField({ error, ...rest }: UnderlineFieldProps) {
  return (
    <S.Field>
      <S.Input data-error={error ? 'true' : 'false'} {...rest} />
      {error && <S.ErrorText role='alert'>{error}</S.ErrorText>}
    </S.Field>
  )
}
