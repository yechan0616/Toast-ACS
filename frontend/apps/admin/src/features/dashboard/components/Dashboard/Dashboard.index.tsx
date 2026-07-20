'use client'

import { Button, easeOutExpo } from '@toast-acs/ui'
import { fetchOverview, openGate } from 'features/dashboard/api'
import { useEffect, useState } from 'react'
import { usePolling } from 'shared/usePolling'
import { GateStatus } from '../GateStatus/GateStatus.index'
import { LiveStatus } from '../LiveStatus/LiveStatus.index'
import { RecentAlerts } from '../RecentAlerts/RecentAlerts.index'
import { SuspicionBadge } from '../SuspicionBadge/SuspicionBadge.index'
import * as S from './Dashboard.styled'

const POLL_MS = 3000
const NOTICE_MS = 4000
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

interface Notice {
  text: string
  tone: 'success' | 'danger'
}

export function Dashboard() {
  const { data: overview, error } = usePolling(fetchOverview, POLL_MS)
  const [opening, setOpening] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), NOTICE_MS)
    return () => clearTimeout(timer)
  }, [notice])

  const handleOpen = async () => {
    setOpening(true)
    setNotice(null)
    try {
      await openGate('관리자 원격 개방')
      setNotice({
        text: '개방 명령을 게이트 큐에 넣었습니다.',
        tone: 'success',
      })
    } catch {
      setNotice({ text: '개방 명령을 보내지 못했습니다.', tone: 'danger' })
    } finally {
      setOpening(false)
    }
  }

  return (
    <S.Page>
      <S.PageHeader>
        <S.TitleGroup>
          <S.TitleRow>
            <S.Title>대시보드</S.Title>
            <S.LivePill>
              <S.LiveDot />
              실시간
            </S.LivePill>
          </S.TitleRow>
          <S.Sub>출입 현황과 이용권 신청을 한눈에 확인합니다.</S.Sub>
        </S.TitleGroup>
        <S.HeaderActions>
          <Button size='small' onClick={handleOpen} disabled={opening}>
            {opening ? '개방 중…' : '원격 개방'}
          </Button>
        </S.HeaderActions>
      </S.PageHeader>

      {notice && <S.Notice data-tone={notice.tone}>{notice.text}</S.Notice>}

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
              <RecentAlerts />
              <S.RightStack>
                <GateStatus gate={overview.gate} />
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
