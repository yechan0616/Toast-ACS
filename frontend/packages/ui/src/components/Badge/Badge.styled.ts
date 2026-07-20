import styled from '@emotion/styled'

export const Root = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
  white-space: nowrap;

  &[data-tone='success'] {
    background: ${({ theme }) => theme.colors.badgeSuccessBg};
    color: ${({ theme }) => theme.colors.badgeSuccessText};
  }

  &[data-tone='danger'] {
    background: ${({ theme }) => theme.colors.badgeDangerBg};
    color: ${({ theme }) => theme.colors.badgeDangerText};
  }

  &[data-tone='warning'] {
    background: ${({ theme }) => theme.colors.badgeWarningBg};
    color: ${({ theme }) => theme.colors.badgeWarningText};
  }

  &[data-tone='info'] {
    background: ${({ theme }) => theme.colors.badgeInfoBg};
    color: ${({ theme }) => theme.colors.badgeInfoText};
  }

  &[data-tone='neutral'] {
    background: ${({ theme }) => theme.colors.badgeNeutralBg};
    color: ${({ theme }) => theme.colors.badgeNeutralText};
  }
`
