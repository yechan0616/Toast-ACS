import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: block;
  min-width: 0;
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: -0.01em;
`

export const MoreLink = styled.button`
  border: 0;
  background: none;
  padding: 0;
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
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
  min-width: 0;
`

export const TypeRow = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`

export const Type = styled.span`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TimePill = styled.span`
  margin-left: 6px;
  flex-shrink: 0;
  padding: 1px 7px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.controlGray};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const Detail = styled.div`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Empty = styled.p`
  margin: 0;
  padding: 4px 0 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`
