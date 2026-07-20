import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'

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

export const Expected = styled.span`
  color: ${({ theme }) => theme.colors.body};
  font-size: 13px;
  font-variant-numeric: tabular-nums;
`

export const Precondition = styled.span`
  color: ${({ theme }) => theme.colors.faint};
  font-size: 12px;
  line-height: 1.45;
`

export const Outcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
`

export const Result = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const ResultCode = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: 13px;
`

export const OutcomeText = styled.span`
  color: ${({ theme }) => theme.colors.body};
  line-height: 1.45;
`
