import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'
import { motion } from 'framer-motion'

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(67, 160, 71, 0.45); }
  70% { box-shadow: 0 0 0 6px rgba(67, 160, 71, 0); }
  100% { box-shadow: 0 0 0 0 rgba(67, 160, 71, 0); }
`

const shimmer = keyframes`
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
`

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`

export const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: -0.03em;
`

export const LivePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.badgeSuccessBg};
  color: ${({ theme }) => theme.colors.badgeSuccessText};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
`

export const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: ${pulse} 2s ease-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Sub = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.body};
  font-size: 14px;
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const GatePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${({ theme }) => theme.colors.body};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
`

export const GateDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.danger};

  ${GatePill}[data-online='true'] & {
    background: #12b76a;
  }
`

export const Item = styled(motion.div)`
  min-width: 0;
`

export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const RightStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`

export const Notice = styled.output`
  display: block;
  margin: 0;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.card};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &[data-tone='success'] {
    background: ${({ theme }) => theme.colors.badgeSuccessBg};
    color: ${({ theme }) => theme.colors.badgeSuccessText};
  }

  &[data-tone='danger'] {
    background: ${({ theme }) => theme.colors.badgeDangerBg};
    color: ${({ theme }) => theme.colors.badgeDangerText};
  }
`

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const SkeletonStat = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${shimmer} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const SkeletonBar = styled.span`
  width: 72px;
  height: 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.controlGray};

  &[data-size='lg'] {
    width: 96px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.card};
  }
`
