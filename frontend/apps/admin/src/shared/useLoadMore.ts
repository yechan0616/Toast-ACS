'use client'

import type { Page } from '@toast-acs/shared'
import { useCallback, useState } from 'react'

interface LoadMoreState<T> {
  rows: T[]
  hasMore: boolean
  loadingMore: boolean
  loadMore: () => Promise<void>
  reset: () => void
}

export function useLoadMore<T>(
  live: Page<T> | null,
  fetchPage: (page: number) => Promise<Page<T>>,
  getKey: (item: T) => string | number,
): LoadMoreState<T> {
  const [older, setOlder] = useState<T[]>([])
  const [nextPage, setNextPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const liveRows = live?.content ?? []
  const liveKeys = new Set(liveRows.map(getKey))
  const rows = [
    ...liveRows,
    ...older.filter((item) => !liveKeys.has(getKey(item))),
  ]
  const hasMore = live !== null && nextPage < live.totalPages

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const page = await fetchPage(nextPage).catch(() => null)
    if (page) {
      setOlder((prev) => {
        const seen = new Set(prev.map(getKey))
        return [
          ...prev,
          ...page.content.filter((item) => !seen.has(getKey(item))),
        ]
      })
      setNextPage((prev) => prev + 1)
    }
    setLoadingMore(false)
  }

  const reset = useCallback(() => {
    setOlder([])
    setNextPage(1)
  }, [])

  return { rows, hasMore, loadingMore, loadMore, reset }
}
