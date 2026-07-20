'use client'

import { css, Global, useTheme } from '@emotion/react'
import { palettes } from './theme'

const cssVars = (palette: Record<string, string>) =>
  Object.entries(palette)
    .map(([name, value]) => `--c-${name}: ${value};`)
    .join('\n')

export function GlobalStyles() {
  const theme = useTheme()

  return (
    <Global
      styles={css`
        :root {
          ${cssVars(palettes.light)}
        }

        html[data-mode='dark'] {
          ${cssVars(palettes.dark)}
        }

        html.mode-transition,
        html.mode-transition *,
        html.mode-transition *::before,
        html.mode-transition *::after {
          transition:
            background-color 0.35s ease,
            color 0.35s ease,
            border-color 0.35s ease,
            fill 0.35s ease,
            stroke 0.35s ease !important;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html {
          background: ${theme.colors.background};
        }

        body {
          margin: 0;
          background: ${theme.colors.background};
          color: ${theme.colors.text};
          font-family: ${theme.fonts.base};
          letter-spacing: ${theme.letterSpacings.kr};
          -webkit-font-smoothing: antialiased;
          word-break: keep-all;
          overflow-wrap: break-word;
          user-select: none;
          -webkit-user-select: none;
        }

        a {
          color: inherit;
          text-decoration: none;
          -webkit-user-drag: none;
        }

        img {
          -webkit-user-drag: none;
        }

        button {
          font: inherit;
        }

        button:disabled {
          cursor: default;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}
    />
  )
}
