import styled from '@emotion/styled'
import { Card, Td } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`

export const Notice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`

export const IssuedList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const IssuedItem = styled.li`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.badgeSuccessText};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.badgeSuccessBg};
  color: ${({ theme }) => theme.colors.body};
  font-size: 13px;
`

export const IssuedCode = styled.strong`
  color: ${({ theme }) => theme.colors.badgeSuccessText};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
`

export const NameTd = styled(Td)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

export const Actions = styled.div`
  display: flex;
  gap: 6px;
`

export const ReasonTd = styled(Td)`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  white-space: normal;
`

export const FormTd = styled(Td)`
  white-space: normal;
`

export const ApproveForm = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`

export const TypeOptions = styled.div`
  display: flex;
  gap: 6px;
`

export const RejectForm = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 480px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`

export const Empty = styled.p`
  margin: 0;
  padding: 12px 0;
  color: ${({ theme }) => theme.colors.faint};
  font-size: 14px;
`

export const MoreRow = styled.div`
  display: flex;
  justify-content: center;
`
