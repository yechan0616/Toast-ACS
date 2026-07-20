import styled from '@emotion/styled'

export const Scroll = styled.div`
  overflow-x: auto;
`

export const Root = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
`

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.faint};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;

  &:first-of-type {
    border-radius: ${({ theme }) => theme.radii.card} 0 0
      ${({ theme }) => theme.radii.card};
  }

  &:last-of-type {
    border-radius: 0 ${({ theme }) => theme.radii.card}
      ${({ theme }) => theme.radii.card} 0;
  }
`

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  color: ${({ theme }) => theme.colors.body};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transition: background-color 0.15s ease;

  tbody tr:hover > & {
    background: ${({ theme }) => theme.colors.surface};
  }
`
