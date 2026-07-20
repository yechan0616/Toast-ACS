import styled from '@emotion/styled'

export const Bar = styled.header`
  display: flex;
  align-items: center;
  height: 60px;
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-left: -10px;
  padding: 0;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition:
    opacity 0.22s ${({ theme }) => theme.easing.standard},
    transform 0.22s ${({ theme }) => theme.easing.standard};

  &:active {
    transform: scale(0.92);
    opacity: 0.5;
  }

  @media (hover: hover) {
    &:hover {
      opacity: 0.7;
    }
  }
`
