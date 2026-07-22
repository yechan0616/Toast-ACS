import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: block;
`

export const Title = styled.h2`
  margin: 0 0 18px;
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: -0.01em;
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 11px;
`

export const IconCircle = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.badgeDangerBg};
  color: ${({ theme }) => theme.colors.danger};
`

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`

export const Type = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

export const Detail = styled.div`
  margin-top: 2px;
  color: #8a93a6;
  font-size: 12px;
`

export const Time = styled.span`
  flex-shrink: 0;
  color: #8a93a6;
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const Empty = styled.p`
  margin: 0;
  padding: 4px 0 8px;
  color: #8a93a6;
  font-size: 14px;
`

export const MoreRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`
