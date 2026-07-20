'use client'

import * as S from './Tabs.styled'

export interface TabItem<T extends string> {
  label: string
  value: T
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[]
  value: T
  onChange: (value: T) => void
  variant?: 'line' | 'button'
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'line',
}: TabsProps<T>) {
  return (
    <S.List role='tablist' data-variant={variant}>
      {items.map((item) => (
        <S.Item
          key={item.value}
          type='button'
          role='tab'
          aria-selected={item.value === value}
          data-variant={variant}
          data-active={item.value === value ? 'true' : 'false'}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </S.Item>
      ))}
    </S.List>
  )
}
