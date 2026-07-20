import type { Variants } from 'framer-motion'

export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const easeStandard = [0.4, 0, 0.2, 1] as const

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
}

export const fadeUpSoft: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: easeOutExpo },
  },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

export const pageFade: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeOutExpo },
  },
}

export const tap = {
  scale: 0.985,
  transition: { duration: 0.2, ease: easeStandard },
} as const

export const viewportOnce = { once: true, margin: '0px 0px -60px' } as const
