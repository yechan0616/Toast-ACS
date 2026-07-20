'use client'

import { useEffect, useState } from 'react'

interface PollingState<T> {
  data: T | null
  error: boolean
}

export function usePolling<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  intervalMs: number,
): PollingState<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    let controller: AbortController | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const tick = async () => {
      controller?.abort()
      const current = new AbortController()
      controller = current
      try {
        const next = await fetcher(current.signal)
        if (active) {
          setData(next)
          setError(false)
        }
      } catch {
        if (active && !current.signal.aborted) setError(true)
      } finally {
        if (active) timer = setTimeout(tick, intervalMs)
      }
    }

    tick()

    return () => {
      active = false
      controller?.abort()
      if (timer) clearTimeout(timer)
    }
  }, [fetcher, intervalMs])

  return { data, error }
}
