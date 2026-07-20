import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const MoreLink = styled.button`
  border: 0;
  background: none;
  padding: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Item = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: auto 1fr;
  }
`

export const Message = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.body};
  line-height: 1.45;
`

export const Time = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.faint};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-column: 2;
  }
`

export const Empty = styled.p`
  margin: 0;
  padding: 12px 0;
  color: ${({ theme }) => theme.colors.faint};
  font-size: 14px;
`
