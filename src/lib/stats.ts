'use client'

import { getBrowserSupabase } from '@/lib/supabaseBrowser'
import {
  isResourceTemplateId,
  type ResourceTemplateId,
} from '@/lib/templateIds'

export type SiteStats = {
  total_visits: number
  monthly_visits: number
  unique_visitors: number
}

const VISIT_SESSION_KEY = 'sakera_visit_session'
const VISITOR_KEY = 'sakera_visitor_id'

export type LiveStatsPayload = {
  stats: SiteStats
  template_downloads: Record<string, number>
}

async function fetchStatsFromApi(): Promise<LiveStatsPayload | null> {
  try {
    const res = await fetch('/api/stats', { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    if (!json?.success || !json?.data) return null
    return {
      stats: {
        total_visits: Number(json.data.total_visits ?? 0),
        monthly_visits: Number(json.data.monthly_visits ?? 0),
        unique_visitors: Number(json.data.unique_visitors ?? 0),
      },
      template_downloads: (json.data.template_downloads || {}) as Record<string, number>,
    }
  } catch {
    return null
  }
}

/** Single round-trip for visits + template download counts (preferred). */
export async function fetchLiveStats(): Promise<LiveStatsPayload> {
  const fromApi = await fetchStatsFromApi()
  if (fromApi) return fromApi

  const [stats, template_downloads] = await Promise.all([
    fetchSiteStatsDirect(),
    fetchDownloadCountsDirect(),
  ])
  return { stats, template_downloads }
}

async function fetchSiteStatsDirect(): Promise<SiteStats> {
  const supabase = getBrowserSupabase()
  if (!supabase) {
    return { total_visits: 0, monthly_visits: 0, unique_visitors: 0 }
  }

  const { data, error } = await supabase
    .from('site_stats')
    .select('total_visits, monthly_visits, unique_visitors')
    .eq('id', 'global')
    .maybeSingle()

  if (error) throw error
  return {
    total_visits: Number(data?.total_visits ?? 0),
    monthly_visits: Number(data?.monthly_visits ?? 0),
    unique_visitors: Number(data?.unique_visitors ?? 0),
  }
}

export async function fetchSiteStats(): Promise<SiteStats> {
  const fromApi = await fetchStatsFromApi()
  if (fromApi) return fromApi.stats
  return fetchSiteStatsDirect()
}

/**
 * Once per browser tab session. Unique visitors only when localStorage has no visitor id.
 * Visits ≈ sessions; unique ≈ first-time browsers that still hold the key.
 */
export async function registerVisit(): Promise<SiteStats | null> {
  if (typeof window === 'undefined') return null
  if (sessionStorage.getItem(VISIT_SESSION_KEY)) return null
  sessionStorage.setItem(VISIT_SESSION_KEY, '1')

  const isNewVisitor = !localStorage.getItem(VISITOR_KEY)
  if (isNewVisitor) localStorage.setItem(VISITOR_KEY, crypto.randomUUID())

  try {
    const res = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'visit',
        is_new_visitor: isNewVisitor,
        path: window.location.pathname,
      }),
    })
    if (res.ok) {
      const json = await res.json()
      if (json?.success && json?.data) {
        return {
          total_visits: Number(json.data.total_visits ?? 0),
          monthly_visits: Number(json.data.monthly_visits ?? 0),
          unique_visitors: Number(json.data.unique_visitors ?? 0),
        }
      }
    }
  } catch {
    // fall through to browser RPC
  }

  const supabase = getBrowserSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.rpc('register_visit', {
    is_new_visitor: isNewVisitor,
  })
  if (error) throw error

  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return {
    total_visits: Number(row.total_visits ?? 0),
    monthly_visits: Number(row.monthly_visits ?? 0),
    unique_visitors: Number(row.unique_visitors ?? 0),
  }
}

async function fetchDownloadCountsDirect(): Promise<Record<string, number>> {
  const supabase = getBrowserSupabase()
  if (!supabase) return {}

  const { data, error } = await supabase.from('templates').select('id, download_count')
  if (error) throw error

  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    map[row.id] = Number(row.download_count ?? 0)
  }
  return map
}

export async function fetchDownloadCounts(): Promise<Record<string, number>> {
  const fromApi = await fetchStatsFromApi()
  if (fromApi && Object.keys(fromApi.template_downloads).length > 0) {
    return fromApi.template_downloads
  }
  if (fromApi) return fromApi.template_downloads
  return fetchDownloadCountsDirect()
}

export async function registerDownload(resourceId: ResourceTemplateId): Promise<number> {
  if (!isResourceTemplateId(resourceId)) {
    throw new Error('Unknown template')
  }

  try {
    const res = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'download',
        id: resourceId,
        path: typeof window !== 'undefined' ? window.location.pathname : '/templates',
      }),
    })
    if (res.ok) {
      const json = await res.json()
      if (json?.success) {
        return Number(json.data?.download_count ?? 0)
      }
    }
  } catch {
    // fall through to browser RPC
  }

  const supabase = getBrowserSupabase()
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.rpc('register_download', {
    p_resource_id: resourceId,
  })
  if (error) throw error
  return Number(data ?? 0)
}

/** Trigger a file save via a temporary <a download>, then register the download. */
export function triggerFileDownload(fileUrl: string) {
  if (typeof document === 'undefined') return
  const filename = fileUrl.split('/').pop() ?? 'template'
  const link = document.createElement('a')
  link.href = fileUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}
