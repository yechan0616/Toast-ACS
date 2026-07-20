import styled from '@emotion/styled'
import { Card, Td } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`

export const DeviceTd = styled(Td)`
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 180px;
  }
`

export const Notice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`

export const RevokedNotice = styled.p`
  margin: 0;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.badgeSuccessText};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.badgeSuccessBg};
  color: ${({ theme }) => theme.colors.body};
  font-size: 13px;
`

export const FormTd = styled(Td)`
  white-space: normal;
`

export const RevokeForm = styled.div`
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
