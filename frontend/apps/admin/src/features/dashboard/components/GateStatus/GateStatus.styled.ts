import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Card as UiCard } from '@toast-acs/ui'

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(67, 160, 71, 0.45); }
  70% { box-shadow: 0 0 0 5px rgba(67, 160, 71, 0); }
  100% { box-shadow: 0 0 0 0 rgba(67, 160, 71, 0); }
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

export const Card = styled(UiCard)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

export const Seen = styled.span`
  color: ${({ theme }) => theme.colors.faint};
  font-size: 12px;
  font-variant-numeric: tabular-nums;
`
