'use client'

import { setUnauthorizedHandler } from '@toast-acs/shared'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function SessionWatcher() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setUnauthorizedHandler((error) => {
      if (error.code === 'UNAUTHORIZED' && pathname !== '/login') {
        router.replace('/login')
      }
    })
    return () => setUnauthorizedHandler(() => {})
  }, [router, pathname])

  return null
}
