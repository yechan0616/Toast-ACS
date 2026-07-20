'use client'

import type { PassRequestState } from '@toast-acs/shared'
import { ApiError } from '@toast-acs/shared'
import { fetchPassRequest } from 'features/pass/api'
import { useEffect, useRef, useState } from 'react'

const POLL_MS = 3000

export function usePassRequestStatus(
  requestId: string | null,
  onMissing: () => void,
) {
  const [state, setState] = useState<PassRequestState | null>(null)
  const onMissingRef = useRef(onMissing)
  onMissingRef.current = onMissing

  useEffect(() => {
    setState(null)
    if (!requestId) return
    let active = true
    let controller = new AbortController()

    const tick = async () => {
      controller = new AbortController()
      try {
        const next = await fetchPassRequest(requestId, controller.signal)
        if (!active) return
        setState(next)
        if (next.status !== 'PENDING') clearInterval(id)
      } catch (err) {
        if (!active) return
        if (err instanceof ApiError && err.code === 'REQUEST_NOT_FOUND') {
          clearInterval(id)
          onMissingRef.current()
        }
      }
    }

    tick()
    const id = setInterval(tick, POLL_MS)

    return () => {
      active = false
      controller.abort()
      clearInterval(id)
    }
  }, [requestId])

  return state
}
