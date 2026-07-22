import styled from '@emotion/styled'

export const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: #eef0f3;
`

export const Card = styled.div`
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border: 1px solid #d5d9e0;
  border-top: 3px solid ${({ theme }) => theme.colors.accent};
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid #e6e8ee;
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  & img {
    display: block;
  }
`

export const BrandName = styled.span`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: -0.01em;
`

export const Console = styled.span`
  color: #8a93a6;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  color: #475569;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #c9ced8;
  border-radius: 0;
  background: #ffffff;
  color: #0b0d12;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(1, 60, 255, 0.12);
  }
`

export const Submit = styled.button`
  height: 42px;
  margin-top: 2px;
  padding: 0 16px;
  border: 0;
  border-radius: 0;
  background: ${({ theme }) => theme.colors.accent};
  color: #ffffff;
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 140ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  border-top: 1px solid #e6e8ee;
  background: #fafbfc;
`

export const Note = styled.span`
  color: #8a93a6;
  font-size: 11px;
`

export const Version = styled.span`
  color: #b0b7c3;
  font-size: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
`
