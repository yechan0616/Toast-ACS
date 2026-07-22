import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const Cell = styled(motion.div)`
  min-width: 0;
  display: flex;

  & > * {
    flex: 1;
  }
`

export const Stat = styled(Card)`
  display: block;
  height: 100%;
  transition: box-shadow 0.35s ease;

  @media (hover: hover) {
    ${Cell}:hover & {
      box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.05),
        0 18px 36px -18px rgba(1, 60, 255, 0.28);
    }
  }
`

export const StatLink = styled(Link)`
  display: flex;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  & > * {
    flex: 1;
  }
`

export const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.body};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
`

export const IconBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.controlGray};
  color: ${({ theme }) => theme.colors.muted};

  &[data-tone='accent'] {
    background: rgba(1, 60, 255, 0.1);
    color: ${({ theme }) => theme.colors.accent};
  }

  &[data-tone='danger'] {
    background: ${({ theme }) => theme.colors.badgeDangerBg};
    color: ${({ theme }) => theme.colors.danger};
  }
`

export const Value = styled(motion.span)`
  display: block;
  margin-top: 18px;
  font-size: 40px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: -0.035em;
  line-height: 1;
  font-variant-numeric: tabular-nums;

  &[data-tone='accent'] {
    color: ${({ theme }) => theme.colors.accent};
  }

  &[data-tone='danger'] {
    color: ${({ theme }) => theme.colors.danger};
  }
`
