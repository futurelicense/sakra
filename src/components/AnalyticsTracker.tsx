'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { registerVisit } from '@/lib/stats'

/**
 * Adeola-style: one site visit per browser tab session.
 * Skips /admin. Does not count on refresh within the same tab.
 * Dispatches sakera:stats so live counters refresh after the increment.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    registerVisit()
      .then((stats) => {
        if (stats) {
          window.dispatchEvent(new CustomEvent('sakera:stats', { detail: stats }))
        }
      })
      .catch(() => {})
  }, [pathname])

  return null
}
