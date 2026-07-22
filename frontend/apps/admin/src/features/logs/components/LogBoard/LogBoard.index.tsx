'use client'

import type { LogType } from '@toast-acs/shared'
import { useState } from 'react'
import * as T from 'shared/adminTable'
import { AccessLog } from '../AccessLog/AccessLog.index'
import { AlertFeed } from '../AlertFeed/AlertFeed.index'
import * as S from './LogBoard.styled'

const TABS: { label: string; value: LogType }[] = [
  { label: '출입', value: 'ENTRY' },
  { label: '거부', value: 'DENIED' },
  { label: '세션 종료', value: 'SESSION_KILL' },
]

export function LogBoard() {
  const [type, setType] = useState<LogType>('ENTRY')

  return (
    <S.Page>
      <T.PageHeader>
        <div>
          <T.PageTitle>출입 · 경보 로그</T.PageTitle>
          <T.PageSub>
            출입과 거부, 세션 종료, 경보를 모두 여기서 볼 수 있어요.
          </T.PageSub>
        </div>
        <T.Segmented>
          {TABS.map((tab) => (
            <T.SegButton
              key={tab.value}
              type='button'
              data-active={type === tab.value}
              onClick={() => setType(tab.value)}
            >
              {tab.label}
            </T.SegButton>
          ))}
        </T.Segmented>
      </T.PageHeader>
      <AccessLog type={type} />
      <AlertFeed />
    </S.Page>
  )
}
