import styled from '@emotion/styled'
import { brandColors, typo } from '@toast-acs/ui'
import { motion } from 'framer-motion'

export const Main = styled.main`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 75% 25%;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const Brand = styled.aside`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  padding: 56px;
  color: #ffffff;
  background:
    radial-gradient(
      120% 120% at 12% 8%,
      ${brandColors.sub1} 0%,
      transparent 55%
    ),
    linear-gradient(150deg, ${brandColors.main} 0%, ${brandColors.sub1} 100%);
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(120% 80% at 80% 100%, #000 0%, transparent 70%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

export const Wordmark = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.en};
`

export const Glyph = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(4px);
`

export const BrandCopy = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 520px;
`

export const Tagline = styled(motion.p)`
  margin: 0;
  ${({ theme }) =>
    typo(theme.typography.pc.headline.h3, theme.fontWeights.semibold)}
`

export const TaglineSub = styled(motion.p)`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  ${({ theme }) => typo(theme.typography.pc.body.b2, theme.fontWeights.regular)}
`

export const Panel = styled.div`
  display: grid;
  place-items: center;
  padding: 40px 24px;
`

export const Card = styled(motion.div)`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Reveal = styled(motion.div)`
  min-width: 0;
`

export const Brandmark = styled.div`
  display: none;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`

export const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => typo(theme.typography.pc.title.t3, theme.fontWeights.semibold)}
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  ${({ theme }) => typo(theme.typography.pc.body.b3, theme.fontWeights.regular)}
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Action = styled.div`
  margin-top: 4px;

  & button {
    border-radius: 0;
  }
`

export const ErrorText = styled(motion.p)`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.badgeDangerBg};
  color: ${({ theme }) => theme.colors.badgeDangerText};
  font-size: 13px;
`

export const Footer = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.faint};
  font-size: 12px;
`
