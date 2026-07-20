'use client'

import type { ReactNode } from 'react'
import * as S from './Table.styled'

export function Table({ children }: { children: ReactNode }) {
  return (
    <S.Scroll>
      <S.Root>{children}</S.Root>
    </S.Scroll>
  )
}

export const Th = S.Th
export const Td = S.Td
