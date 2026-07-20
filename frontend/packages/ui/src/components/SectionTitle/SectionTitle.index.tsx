'use client'

import type { ReactNode } from 'react'
import * as S from './SectionTitle.styled'

export function SectionTitle({ children }: { children: ReactNode }) {
  return <S.Title>{children}</S.Title>
}
