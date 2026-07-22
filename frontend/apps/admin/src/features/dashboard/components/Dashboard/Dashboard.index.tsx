'use client'

import { Button, easeOutExpo } from '@toast-acs/ui'
import { fetchOverview, openGate } from 'features/dashboard/api'
import { useState } from 'react'
import { useToast } from 'shared/toast/ToastProvider'
import { usePolling } from 'shared/usePolling'
import { EntryTrend } from '../EntryTrend/EntryTrend.index'
import { LiveStatus } from '../LiveStatus/LiveStatus.index'
import { RecentAlerts } from '../RecentAlerts/RecentAlerts.index'
import { SuspicionBadge } from '../SuspicionBadge/SuspicionBadge.index'
import * as S from './Dashboard.styled'

const POLL_MS = 3000
const SKELETON_KEYS = [
  'inside',
  'session',
  'pending',
  'total',
  'entry',
  'denied',
  'kill',
  'alert',
]

export function Dashboard() {
  const { data: overview, error } = usePolling(fetchOverview, POLL_MS)
  const [opening, setOpening] = useState(false)
  const { notify } = useToast()

  const gateOnline = overview?.gate.online ?? false

  const handleOpen = async () => {
    if (!gateOnline) {
      notify('게이트가 오프라인이에요. 연결된 뒤에 개방할 수 있어요.', 'danger')
      return
    }
    setOpening(true)
    try {
      await openGate('관리자 원격 개방')
      notify('개방 명령을 게이트에 전달했습니다.', 'success')
    } catch {
      notify('개방 명령을 보내지 못했습니다.', 'danger')
    } finally {
      setOpening(false)
    }
  }

  return (
    <S.Page>
      <S.PageHeader>
        <S.TitleGroup>
          <S.Title>대시보드</S.Title>
          <S.Sub>출입 현황과 이용권 신청을 한눈에 확인합니다.</S.Sub>
        </S.TitleGroup>
        <S.HeaderActions>
          {overview && (
            <S.GatePill data-online={overview.gate.online ? 'true' : 'false'}>
              <S.GateDot />
              {overview.gate.online ? '게이트 온라인' : '게이트 오프라인'}
            </S.GatePill>
          )}
          <Button
            size='small'
            onClick={handleOpen}
            disabled={opening || !gateOnline}
          >
            {opening ? '개방 중…' : '원격 개방'}
          </Button>
        </S.HeaderActions>
      </S.PageHeader>

      {overview ? (
        <>
          <S.Item>
            <LiveStatus overview={overview} />
          </S.Item>
          <S.Item
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.35 }}
          >
            <S.Columns>
              <EntryTrend overview={overview} />
              <S.RightStack>
                <RecentAlerts />
                <SuspicionBadge passes={overview.suspectedPasses} />
              </S.RightStack>
            </S.Columns>
          </S.Item>
        </>
      ) : error ? (
        <S.Notice data-tone='danger'>데이터를 불러오지 못했습니다.</S.Notice>
      ) : (
        <S.SkeletonGrid aria-hidden='true'>
          {SKELETON_KEYS.map((key) => (
            <S.SkeletonStat key={key}>
              <S.SkeletonBar />
              <S.SkeletonBar data-size='lg' />
            </S.SkeletonStat>
          ))}
        </S.SkeletonGrid>
      )}
    </S.Page>
  )
}
