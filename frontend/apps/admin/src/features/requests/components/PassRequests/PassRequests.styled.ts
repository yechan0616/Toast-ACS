import styled from '@emotion/styled'

export const Page = styled.div`
  display: block;
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`

export const IssuedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

export const IssuedItem = styled.div`
  padding: 11px 14px;
  border-radius: 10px;
  background: #ecfdf3;
  color: #067647;
  font-size: 13px;
`

export const IssuedCode = styled.strong`
  font-weight: 700;
  letter-spacing: 0.05em;
`
