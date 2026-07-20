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

export const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
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

  &[data-size='xlarge'] {
    height: ${({ theme }) => theme.controls.buttonHeights.xlarge};
    padding: 0 16px;
    font-size: 16px;
  }

  &[data-size='large'] {
    height: ${({ theme }) => theme.controls.buttonHeights.large};
    padding: 0 16px;
    font-size: 16px;
  }

  &[data-size='medium'] {
    height: ${({ theme }) => theme.controls.buttonHeights.medium};
    padding: 0 14px;
    font-size: 14px;
  }

  &[data-size='small'] {
    height: ${({ theme }) => theme.controls.buttonHeights.small};
    padding: 0 12px;
    font-size: 13px;
  }

  &[data-variant='underline'] {
    border: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0;
    background: transparent;
    padding-left: 2px;
    padding-right: 2px;
  }

  &[data-variant='underline']:focus {
    border-bottom-color: ${({ theme }) => theme.colors.focusBorder};
    box-shadow: 0 1px 0 ${({ theme }) => theme.colors.focusBorder};
  }

  &[data-variant='underline'][data-invalid='true'] {
    border-bottom-color: ${({ theme }) => theme.colors.danger};
  }

  &[data-variant='underline']:disabled {
    background: transparent;
    border-bottom-style: dashed;
  }
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`
