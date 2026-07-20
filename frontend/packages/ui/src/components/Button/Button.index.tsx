'use client'

import type { HTMLMotionProps } from 'framer-motion'
import * as S from './Button.styled'

export type ButtonDesign = 'brand' | 'gray' | 'line' | 'danger'
export type ButtonSize =
  | 'tiny'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'

interface ButtonProps extends HTMLMotionProps<'button'> {
  design?: ButtonDesign
  size?: ButtonSize
  round?: boolean
  full?: boolean
}

export function Button({
  design = 'brand',
  size = 'medium',
  round = false,
  full = false,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <S.Root
      type={type}
      data-design={design}
      data-size={size}
      data-round={round ? 'true' : 'false'}
      data-full={full ? 'true' : 'false'}
      whileTap={{ scale: 0.98 }}
      {...rest}
    >
      {children}
    </S.Root>
  )
}
