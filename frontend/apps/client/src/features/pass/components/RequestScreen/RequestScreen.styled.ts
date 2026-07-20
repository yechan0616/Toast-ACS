import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'
import { motion } from 'framer-motion'

export const Main = styled.main`
  min-height: 100dvh;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.grid.mobileMargin}
    calc(140px + env(safe-area-inset-bottom));
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const TitleSlot = styled(motion.div)`
  display: flex;
`

export const Title = styled.h1`
  margin: 0;
  ${({ theme }) => typo(theme.typography.mo.title.t1, theme.fontWeights.semibold)}
`

export const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.mo.title.t4, theme.fontWeights.regular)}
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Status = styled(motion.section)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
