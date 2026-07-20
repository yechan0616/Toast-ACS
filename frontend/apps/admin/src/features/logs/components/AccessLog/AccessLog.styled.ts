import styled from '@emotion/styled'
import { Card } from '@toast-acs/ui'

export const Section = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
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
