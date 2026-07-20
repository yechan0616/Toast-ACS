'use client'

import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'
import * as S from './TextField.styled'

export type FieldSize = 'small' | 'medium' | 'large' | 'xlarge'
export type FieldVariant = 'box' | 'underline'

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string | null
  size?: FieldSize
  variant?: FieldVariant
}

export function TextField({
  label,
  error,
  size = 'large',
  variant = 'box',
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <S.Field className={className}>
      {label && <S.Label htmlFor={inputId}>{label}</S.Label>}
      <S.Input
        id={inputId}
        data-size={size}
        data-variant={variant}
        data-invalid={error ? 'true' : 'false'}
        {...rest}
      />
      {error && <S.ErrorText role='alert'>{error}</S.ErrorText>}
    </S.Field>
  )
}
