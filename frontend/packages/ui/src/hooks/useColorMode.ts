'use client'

import { useEffect, useState } from 'react'

const KEY = 'acs-color-mode'

type Mode = 'light' | 'dark'
export type ColorPref = Mode | 'system'

const NEXT: Record<ColorPref, ColorPref> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const systemMode = (): Mode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyToDocument = (mode: Mode) => {
  document.documentElement.dataset.mode = mode
  document.documentElement.style.colorScheme = mode
}

const FADE_MS = 350
let fadeCleanup: (() => void) | undefined

const applyWithFade = (mode: Mode) => {
  const root = document.documentElement
  fadeCleanup?.()
  root.classList.add('mode-transition')
  applyToDocument(mode)

  const done = () => {
    fadeCleanup?.()
  }
  const onEnd = (event: TransitionEvent) => {
    if (event.target === document.body) done()
  }
  document.body.addEventListener('transitionend', onEnd)
  const fallback = window.setTimeout(done, FADE_MS + 400)
  fadeCleanup = () => {
    fadeCleanup = undefined
    window.clearTimeout(fallback)
    document.body.removeEventListener('transitionend', onEnd)
    root.classList.remove('mode-transition')
  }
}

export function useColorMode() {
  const [pref, setPref] = useState<ColorPref>('system')

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') setPref(saved)
  }, [])

  useEffect(() => {
    if (pref !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const follow = () => applyWithFade(systemMode())
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [pref])

  const cycle = () => {
    const next = NEXT[pref]
    setPref(next)
    if (next === 'system') {
      localStorage.removeItem(KEY)
      applyWithFade(systemMode())
    } else {
      localStorage.setItem(KEY, next)
      applyWithFade(next)
    }
  }

  return { pref, cycle }
}
