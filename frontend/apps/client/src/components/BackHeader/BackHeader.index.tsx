'use client'

import * as S from './BackHeader.styled'

export function BackHeader({ onBack }: { onBack: () => void }) {
  return (
    <S.Bar>
      <S.BackButton type='button' aria-label='뒤로가기' onClick={onBack}>
        <svg
          aria-hidden='true'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M15 4 7 12l8 8'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </S.BackButton>
    </S.Bar>
  )
}
