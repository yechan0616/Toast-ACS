import styled from '@emotion/styled'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`

export const Notice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`

export const RevokedNotice = styled.p`
  margin: 0;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.badgeSuccessText};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.badgeSuccessBg};
  color: ${({ theme }) => theme.colors.body};
  font-size: 13px;
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const Count = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  font-variant-numeric: tabular-nums;
`

export const RevokeForm = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`
