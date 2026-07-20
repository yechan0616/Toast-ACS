import styled from '@emotion/styled'

export const List = styled.div`
  display: flex;

  &[data-variant='line'] {
    gap: 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  &[data-variant='button'] {
    gap: 8px;
    flex-wrap: wrap;
  }
`

export const Item = styled.button`
  border: 0;
  background: none;
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;

  &[data-variant='line'] {
    padding: 10px 2px;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 14px;
    font-weight: ${({ theme }) => theme.fontWeights.medium};

    @media (hover: hover) {
      &:hover {
        color: ${({ theme }) => theme.colors.text};
      }
    }

    &[data-active='true'] {
      color: ${({ theme }) => theme.colors.text};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      border-bottom-color: ${({ theme }) => theme.colors.text};
    }
  }

  &[data-variant='button'] {
    height: ${({ theme }) => theme.controls.buttonHeights.small};
    padding: 0 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.body};
    font-size: 13px;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};

    @media (hover: hover) {
      &:hover:not([data-active='true']) {
        background: ${({ theme }) => theme.colors.controlGray};
      }
    }

    &[data-active='true'] {
      background: ${({ theme }) => theme.colors.text};
      border-color: ${({ theme }) => theme.colors.text};
      color: ${({ theme }) => theme.colors.background};
    }
  }
`
