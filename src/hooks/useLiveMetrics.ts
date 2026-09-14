'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchLiveStats } from '@/lib/stats'
import { resourceTemplateIds } from '@/lib/templateIds'

export type LiveMetrics = {
  website_visits: number
  monthly_visits: number
  unique_visitors: number
  template_downloads: Record<string, number>
}

type Options = {
  /** Poll interval in ms. Set 0 to fetch once. Default 5000. */
  intervalMs?: number
}

function hasTemplateCounts(downloads: Record<string, number>) {
  return resourceTemplateIds.some((id) => typeof downloads[id] === 'number')
}

export function useLiveMetrics(options: Options = {}) {
  const intervalMs = options.intervalMs ?? 5000
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const { stats, template_downloads } = await fetchLiveStats()

      // Empty download map with zero visits usually means the client never reached Supabase.
      // Keep prior metrics (if any) instead of publishing a fake "0 live" snapshot.
      if (!hasTemplateCounts(template_downloads) && !stats.total_visits) {
        setError(true)
        return null
      }

      const next: LiveMetrics = {
        website_visits: Number(stats.total_visits) || 0,
        monthly_visits: Number(stats.monthly_visits) || 0,
        unique_visitors: Number(stats.unique_visitors) || 0,
        template_downloads,
      }
      setMetrics(next)
      setError(false)
      return next
    } catch {
      setError(true)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (cancelled) return
      await refresh()
    }
    run()
    if (intervalMs <= 0) {
      return () => {
        cancelled = true
      }
    }
    const timer = setInterval(run, intervalMs)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [intervalMs, refresh])

  const templateTotal = metrics
    ? Object.values(metrics.template_downloads).reduce((a, b) => a + b, 0)
    : null

  return {
    metrics,
    loading,
    error,
    refresh,
    visits: metrics?.website_visits ?? null,
    monthlyVisits: metrics?.monthly_visits ?? null,
    uniqueVisitors: metrics?.unique_visitors ?? null,
    templateDownloads: metrics?.template_downloads ?? null,
    templateTotal,
  }
}
