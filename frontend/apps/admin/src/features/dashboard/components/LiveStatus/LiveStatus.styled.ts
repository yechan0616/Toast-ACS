import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  flex-direction: column;

  & > * {
    flex: 1;
  }
`

export const Stat = styled(Card)`
  display: flex;
  flex-direction: column;
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease,
    box-shadow 0.35s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-3px);
      border-color: ${({ theme }) => theme.colors.accent};
    }
  }
`

export const StatLink = styled(Link)`
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  & > * {
    flex: 1;
  }
`

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
`

export const Value = styled(motion.span)`
  display: block;
  margin-top: 18px;
  font-size: 40px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: -0.035em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;

  &[data-tone='accent'] {
    color: ${({ theme }) => theme.colors.accent};
  }

  &[data-tone='danger'] {
    color: ${({ theme }) => theme.colors.danger};
  }
`
