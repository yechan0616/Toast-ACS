'use client'

import type { TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import * as S from './TextArea.styled'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string | null
}

export function TextArea({
  label,
  error,
  className,
  id,
  rows = 3,
  ...rest
}: TextAreaProps) {
  const autoId = useId()
  const areaId = id ?? autoId

  return (
    <S.Field className={className}>
      {label && <S.Label htmlFor={areaId}>{label}</S.Label>}
      <S.Area
        id={areaId}
        rows={rows}
        data-invalid={error ? 'true' : 'false'}
        {...rest}
      />
      {error && <S.ErrorText role='alert'>{error}</S.ErrorText>}
    </S.Field>
  )
}
