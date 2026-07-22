import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'
import { motion } from 'framer-motion'

export const Main = styled.main`
  min-height: 100dvh;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.grid.mobileMargin}
    calc(140px + env(safe-area-inset-bottom));
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const TitleSlot = styled(motion.div)`
  display: flex;
`

export const Title = styled.h1`
  margin: 0;
  ${({ theme }) => typo(theme.typography.mo.title.t1, theme.fontWeights.semibold)}
`

export const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.title.t4, theme.fontWeights.regular)}
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Status = styled(motion.section)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const SeatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const SeatStage = styled.div`
  padding: 6px 0;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  ${({ theme }) => typo(theme.typography.mo.caption.c2, theme.fontWeights.semibold)}
`

export const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
`

export const SeatButton = styled.button`
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  ${({ theme }) => typo(theme.typography.mo.caption.c2, theme.fontWeights.semibold)}

  &:disabled {
    background: ${({ theme }) => theme.colors.controlDisabled};
    border-color: transparent;
    color: ${({ theme }) => theme.colors.faint};
    cursor: not-allowed;
  }

  &[data-selected='true'] {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    color: #ffffff;
  }
`

export const SeatLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.caption.c2, theme.fontWeights.regular)}
`

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};

  &[data-kind='taken'] {
    background: ${({ theme }) => theme.colors.controlDisabled};
    border-color: transparent;
  }

  &[data-kind='selected'] {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
  }
`

export const SeatLoading = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`

export const SeatError = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`
