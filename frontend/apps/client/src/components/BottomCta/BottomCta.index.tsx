'use client'

import Link from 'next/link'
import * as S from './BottomCta.styled'

interface BottomCtaHelper {
  question: string
  linkLabel: string
  href: string
}

interface BottomCtaProps {
  label: string
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
  helper?: BottomCtaHelper
}

export function BottomCta({
  label,
  disabled = false,
  type = 'button',
  onClick,
  helper,
}: BottomCtaProps) {
  return (
    <S.Dock>
      {helper && (
        <S.Helper>
          <S.HelperQuestion>{helper.question}</S.HelperQuestion>
          <S.HelperLink as={Link} href={helper.href}>
            {helper.linkLabel}
          </S.HelperLink>
        </S.Helper>
      )}
      <S.Cta type={type} onClick={onClick} disabled={disabled}>
        {label}
      </S.Cta>
    </S.Dock>
  )
}
