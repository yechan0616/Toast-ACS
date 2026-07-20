import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'
import { motion } from 'framer-motion'

export const Main = styled.main`
  min-height: 100dvh;
  max-width: 420px;
  margin: 0 auto;
  padding: 60px ${({ theme }) => theme.layout.grid.mobileMargin}
    calc(140px + env(safe-area-inset-bottom));
`

export const Content = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Head = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`

export const Title = styled.h1`
  margin: 0;
  ${({ theme }) => typo(theme.typography.mo.title.t1, theme.fontWeights.bold)}
  font-size: 27px;
`

export const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.title.t4, theme.fontWeights.regular)}
`

export const ServiceCard = styled.section`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};

  &[data-expired='true'] {
    opacity: 0.55;
  }
`

export const CardService = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.body};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`

export const CardGate = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`

export const CardExpiry = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;
  ${({ theme }) =>
    typo(
      theme.typography.mo.caption.c1,
      theme.fontWeights.semibold,
      theme.letterSpacings.en,
    )}
`

export const CardCount = styled.p`
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  color: ${({ theme }) => theme.colors.body};
  font-variant-numeric: tabular-nums;
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`

export const RevokeNotice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.badgeDangerBg};
`

export const RevokeLabel = styled.span`
  color: ${({ theme }) => theme.colors.badgeDangerText};
  ${({ theme }) => typo(theme.typography.mo.caption.c2, theme.fontWeights.semibold)}
`

export const RevokeText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => typo(theme.typography.mo.body.b2, theme.fontWeights.regular)}
`

export const Feedback = styled.p`
  margin: 0;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.body};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}

  &[data-allowed='false'] {
    color: ${({ theme }) => theme.colors.danger};
  }
`

export const Loading = styled.p`
  padding-top: 120px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.body.b2, theme.fontWeights.regular)}
`
