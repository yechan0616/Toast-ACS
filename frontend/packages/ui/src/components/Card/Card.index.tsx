'use client'

import type { HTMLAttributes } from 'react'
import * as S from './Card.styled'

export function Card({ children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <S.Root {...rest}>{children}</S.Root>
}
