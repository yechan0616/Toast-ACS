import styled from '@emotion/styled'
import { motion } from 'framer-motion'

export const Root = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.control};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.focusRing};
  }

  &:disabled {
    opacity: 1;
    cursor: default;
  }

  &[data-round='true'] {
    border-radius: ${({ theme }) => theme.radii.pill};
  }

  &[data-full='true'] {
    width: 100%;
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

  &[data-size='xsmall'] {
    height: ${({ theme }) => theme.controls.buttonHeights.xsmall};
    padding: 0 12px;
    font-size: 13px;
  }

  &[data-size='tiny'] {
    height: ${({ theme }) => theme.controls.buttonHeights.tiny};
    padding: 0 10px;
    font-size: 12px;
  }

  &[data-design='brand'] {
    background: ${({ theme }) => theme.colors.accent};
    color: #ffffff;

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.accentHover};
      }
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentPress};
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.controlDisabled};
    }
  }

  &[data-design='gray'] {
    background: ${({ theme }) => theme.colors.controlGray};
    color: ${({ theme }) => theme.colors.text};

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.controlGrayHover};
      }
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.controlGrayPress};
    }

    &:disabled {
      color: ${({ theme }) => theme.colors.faint};
    }
  }

  &[data-design='line'] {
    background: ${({ theme }) => theme.colors.card};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.controlGray};
      }
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.controlGrayHover};
    }

    &:disabled {
      color: ${({ theme }) => theme.colors.faint};
    }
  }

  &[data-design='danger'] {
    background: ${({ theme }) => theme.colors.danger};
    color: #ffffff;

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.dangerHover};
      }
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.dangerPress};
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.controlDisabled};
    }
  }
`
