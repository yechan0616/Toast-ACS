import styled from '@emotion/styled'
import { typo } from '@toast-acs/ui'
import { motion } from 'framer-motion'

export const Page = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const PageHeader = styled(motion.header)`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Title = styled.h1`
  margin: 0;
  ${({ theme }) =>
    typo(theme.typography.pc.headline.h4, theme.fontWeights.semibold)}
`

export const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`

export const Item = styled(motion.div)`
  min-width: 0;
`
