import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.card};
`

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const Time = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.faint};
  font-variant-numeric: tabular-nums;
`

export const Message = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.body};
  line-height: 1.45;
`

export const Empty = styled.p`
  margin: 0;
  padding: 16px 0;
  color: ${({ theme }) => theme.colors.faint};
  font-size: 14px;
`

export const MoreRow = styled.div`
  display: flex;
  justify-content: center;
`
