import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 16px 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => typo(theme.typography.mo.title.t4, theme.fontWeights.regular)}
  transition: border-color 0.22s ${({ theme }) => theme.easing.standard};

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.text};
  }

  &[data-error='true'] {
    border-bottom-color: ${({ theme }) => theme.colors.danger};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.text};
    -webkit-text-fill-color: ${({ theme }) => theme.colors.text};
    opacity: 1;
  }
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`
