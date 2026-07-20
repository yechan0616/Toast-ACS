'use client'

import createCache from '@emotion/cache'
import { CacheProvider, ThemeProvider } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { theme } from './theme'

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'css' })
    cache.compat = true

    const prevInsert = cache.insert
    let inserted: string[] = []

    cache.insert = (...args) => {
      const [, serialized] = args

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }

      return prevInsert(...args)
    }

    const flush = () => {
      const flushed = inserted
      inserted = []
      return flushed
    }

    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()

    if (names.length === 0) {
      return null
    }

    let styles = ''

    for (const name of names) {
      const style = cache.inserted[name]

      if (typeof style === 'string') {
        styles += style
      }
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: emotion SSR 스타일을 주입해요
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  )
}
