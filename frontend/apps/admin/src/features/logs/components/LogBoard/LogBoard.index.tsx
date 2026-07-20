'use client'

import { fadeUp, stagger } from '@toast-acs/ui'
import { AccessLog } from '../AccessLog/AccessLog.index'
import { AlertFeed } from '../AlertFeed/AlertFeed.index'
import * as S from './LogBoard.styled'

export function LogBoard() {
  return (
    <S.Page variants={stagger} initial='hidden' animate='visible'>
      <S.PageHeader variants={fadeUp}>
        <S.TitleGroup>
          <S.Title>출입 · 경보 로그</S.Title>
          <S.Sub>출입 이력과 거부·세션 종료, 경보를 확인합니다.</S.Sub>
        </S.TitleGroup>
      </S.PageHeader>
      <S.Item variants={fadeUp}>
        <AccessLog />
      </S.Item>
      <S.Item variants={fadeUp}>
        <AlertFeed />
      </S.Item>
    </S.Page>
  )
}
