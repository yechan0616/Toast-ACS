import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'

export const Dock = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.background};
  padding: 12px ${({ theme }) => theme.layout.grid.mobileMargin}
    calc(20px + env(safe-area-inset-bottom));
`

export const Helper = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 0;
  ${({ theme }) => typo(theme.typography.mo.caption.c1, theme.fontWeights.regular)}
`

export const HelperQuestion = styled.span`
  color: ${({ theme }) => theme.colors.text};
`

export const HelperLink = styled.a`
  color: ${({ theme }) => theme.colors.link};

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
`

export const Cta = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  ${({ theme }) => typo(theme.typography.mo.body.b2, theme.fontWeights.semibold)}
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.controlGray};
    color: ${({ theme }) => theme.colors.faint};
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
`
