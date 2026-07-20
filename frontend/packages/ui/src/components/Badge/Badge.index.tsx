'use client'

import type { ReactNode } from 'react'
import * as S from './Badge.styled'

export type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <S.Root data-tone={tone}>{children}</S.Root>
}
