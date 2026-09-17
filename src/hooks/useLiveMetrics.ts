'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchLiveStats } from '@/lib/stats'
import { resourceTemplateIds } from '@/lib/templateIds'
import {
  BASELINE_TOTAL_VISITS,
  floorTemplateDownloads,
  floorUnique,
  floorVisits,
} from '@/lib/baselines'

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
  const [metrics, setMetrics] = useState<LiveMetrics | null>({
    website_visits: BASELINE_TOTAL_VISITS,
    monthly_visits: 0,
    unique_visitors: floorUnique(0),
    template_downloads: floorTemplateDownloads(null),
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const { stats, template_downloads } = await fetchLiveStats()

      // Empty template map means Supabase didn't load (common when Vercel env is missing).
      // Keep seeded baselines and surface as not-live.
      if (!hasTemplateCounts(template_downloads)) {
        setError(true)
        setMetrics((prev) => ({
          website_visits: floorVisits(prev?.website_visits ?? stats.total_visits),
          monthly_visits: Number(prev?.monthly_visits ?? stats.monthly_visits) || 0,
          unique_visitors: floorUnique(prev?.unique_visitors ?? stats.unique_visitors),
          template_downloads: floorTemplateDownloads(prev?.template_downloads ?? null),
        }))
        return null
      }

      const next: LiveMetrics = {
        website_visits: floorVisits(stats.total_visits),
        monthly_visits: Number(stats.monthly_visits) || 0,
        unique_visitors: floorUnique(stats.unique_visitors),
        template_downloads: floorTemplateDownloads(template_downloads),
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

    const onStats = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | { total_visits?: number; monthly_visits?: number; unique_visitors?: number }
        | undefined
      if (!detail) {
        refresh()
        return
      }
      setMetrics((prev) => ({
        website_visits: floorVisits(detail.total_visits ?? prev?.website_visits),
        monthly_visits: Number(detail.monthly_visits ?? prev?.monthly_visits ?? 0),
        unique_visitors: floorUnique(detail.unique_visitors ?? prev?.unique_visitors),
        template_downloads: prev?.template_downloads ?? floorTemplateDownloads(null),
      }))
    }
    window.addEventListener('sakera:stats', onStats)

    if (intervalMs <= 0) {
      return () => {
        cancelled = true
        window.removeEventListener('sakera:stats', onStats)
      }
    }
    const timer = setInterval(run, intervalMs)
    return () => {
      cancelled = true
      clearInterval(timer)
      window.removeEventListener('sakera:stats', onStats)
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
    visits: metrics?.website_visits ?? BASELINE_TOTAL_VISITS,
    monthlyVisits: metrics?.monthly_visits ?? null,
    uniqueVisitors: metrics?.unique_visitors ?? null,
    templateDownloads: metrics?.template_downloads ?? null,
    templateTotal,
  }
}
