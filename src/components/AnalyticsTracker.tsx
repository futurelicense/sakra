'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { registerVisit } from '@/lib/stats'

/**
 * Registers one site visit per browser tab session (homepage or any public page).
 * Skips /admin. Does not count on refresh within the same tab.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    registerVisit().catch(() => {})
  }, [pathname])

  return null
}
