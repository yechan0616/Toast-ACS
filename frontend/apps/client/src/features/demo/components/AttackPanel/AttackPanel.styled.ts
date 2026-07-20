import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'
import { motion } from 'framer-motion'

const pulse = keyframes`
  0% { opacity: 0.35; }
  50% { opacity: 1; }
  100% { opacity: 0.35; }
`

export const Main = styled.main`
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  padding: 32px ${({ theme }) => theme.layout.grid.mobileMargin}
    calc(32px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Head = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Title = styled.h1`
  margin: 0;
  ${({ theme }) =>
    typo(theme.typography.mo.headline.h3, theme.fontWeights.semibold)}
`

export const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.body.b2, theme.fontWeights.regular)}
`

export const Guide = styled.p`
  margin: 0;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.badgeWarningBg};
  color: ${({ theme }) => theme.colors.badgeWarningText};
  ${({ theme }) => typo(theme.typography.mo.body.b3, theme.fontWeights.regular)}
`

export const Note = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.faint};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`

export const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const GroupTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.soft};
  ${({ theme }) => typo(theme.typography.mo.title.t4, theme.fontWeights.semibold)}
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.card};
`

export const ItemHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const ItemLabel = styled.span`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

export const ItemDesc = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  line-height: 1.45;
`

export const Pipeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.surface};
`

export const Layer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.muted};

  &[data-status='pass'] {
    color: ${({ theme }) => theme.colors.body};
  }

  &[data-status='block'] {
    color: ${({ theme }) => theme.colors.danger};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }

  &[data-status='skip'] {
    color: ${({ theme }) => theme.colors.faint};
  }

  &[data-status='wait'] {
    color: ${({ theme }) => theme.colors.faint};
  }

  &[data-status='scan'] {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`

export const LayerMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 11px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.controlGray};
  color: ${({ theme }) => theme.colors.faint};

  &[data-status='pass'] {
    background: ${({ theme }) => theme.colors.badgeSuccessBg};
    color: ${({ theme }) => theme.colors.badgeSuccessText};
  }

  &[data-status='block'] {
    background: ${({ theme }) => theme.colors.badgeDangerBg};
    color: ${({ theme }) => theme.colors.badgeDangerText};
  }

  &[data-status='scan'] {
    background: ${({ theme }) => theme.colors.badgeInfoBg};
    color: ${({ theme }) => theme.colors.badgeInfoText};
    animation: ${pulse} 0.9s ease-in-out infinite;
  }
`

export const Verdict = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`

export const VerdictText = styled.span`
  color: ${({ theme }) => theme.colors.body};
  font-size: 13px;
  line-height: 1.45;
`

export const ResultCode = styled.span`
  margin-right: 6px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`
