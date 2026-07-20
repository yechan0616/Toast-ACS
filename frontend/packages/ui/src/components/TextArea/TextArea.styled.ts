import styled from '@emotion/styled'

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
`

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

export const Area = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 15px;
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
  line-height: 1.45;
  resize: none;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.focusBorder};
    box-shadow: 0 0 2px ${({ theme }) => theme.colors.focusRing};
  }

  &[data-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.controlGray};
    color: ${({ theme }) => theme.colors.faint};
  }
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`
