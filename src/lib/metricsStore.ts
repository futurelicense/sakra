import { generateDummyIp } from '@/lib/dummyIp'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export type DownloadEventType = 'resume' | 'template' | 'publication_pdf'

export interface DownloadEvent {
  id: string
  type: DownloadEventType
  asset_id: string
  asset_label: string
  ip_address: string
  path?: string
  created_at: string
}

export interface VisitEvent {
  id: string
  path: string
  ip_address: string
  created_at: string
}

export interface MetricsState {
  website_visits: number
  monthly_visits: number
  unique_visitors: number
  page_views: Record<string, number>
  resume_downloads: number
  template_downloads: Record<string, number>
  publication_views: Record<string, number>
  publication_downloads: Record<string, number>
  linkedin_clicks: number
  github_clicks: number
  download_events: DownloadEvent[]
  visit_events: VisitEvent[]
}

const TEMPLATE_LABELS: Record<string, string> = {
  'qa-test-case-template': 'Software QA Test Case Template',
  'bug-tracking-template': 'Software Defect & Bug Tracking Template',
  'data-quality-checklist': 'Data Quality & Validation Checklist',
  'data-analysis-project-tracker': 'Data Analysis Project Tracker',
}

const PUBLICATION_LABELS: Record<string, string> = {
  'pub-1': 'ML Defect Prediction in Agile QA Pipelines',
  'pub-2': 'Data Cleansing for Enterprise Datasets',
  'pub-3': 'Benchmarking Test Automation Frameworks',
}

let memory: MetricsState = {
  website_visits: 0,
  monthly_visits: 0,
  unique_visitors: 0,
  page_views: {},
  resume_downloads: 0,
  template_downloads: {},
  publication_views: {},
  publication_downloads: {},
  linkedin_clicks: 0,
  github_clicks: 0,
  download_events: [],
  visit_events: [],
}

/** Skip remote calls after timeouts so polls don't pile up. */
let supabaseDisabledUntil = 0
let loadInFlight: Promise<MetricsState | null> | null = null
let loadInFlightKey: string | null = null
let lastCircuitLogAt = 0

function isCircuitOpen() {
  return Date.now() < supabaseDisabledUntil
}

function openCircuit(ms = 15000) {
  supabaseDisabledUntil = Date.now() + ms
  if (Date.now() - lastCircuitLogAt > 30000) {
    lastCircuitLogAt = Date.now()
    console.warn(`[analytics] Supabase unreachable - using memory for ${Math.round(ms / 1000)}s`)
  }
}

function closeCircuit() {
  supabaseDisabledUntil = 0
}

/** Allow admin refresh to retry Supabase immediately. */
export function resetSupabaseCircuit() {
  closeCircuit()
  loadInFlight = null
  loadInFlightKey = null
}

function toPublicMetrics(state: MetricsState) {
  const { download_events, visit_events, ...publicMetrics } = state
  return publicMetrics
}

function trackEventMemory(
  eventType: string,
  options: { id?: string; path?: string; ip_address?: string; label?: string } = {}
) {
  const { id, path, ip_address, label } = options
  const dummyIp = ip_address || generateDummyIp()

  switch (eventType) {
    case 'website_visit': {
      memory.website_visits += 1
      const visitPath = path || '/'
      memory.page_views[visitPath] = (memory.page_views[visitPath] || 0) + 1
      memory.visit_events = [
        {
          id: `visit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          path: visitPath,
          ip_address: dummyIp,
          created_at: new Date().toISOString(),
        },
        ...memory.visit_events,
      ].slice(0, 500)
      break
    }
    case 'resume_download':
      memory.resume_downloads += 1
      memory.download_events = [
        {
          id: `dl-${Date.now()}`,
          type: 'resume' as const,
          asset_id: 'resume',
          asset_label: label || 'Curriculum Vitae (PDF)',
          ip_address: dummyIp,
          path: path || '/resume',
          created_at: new Date().toISOString(),
        },
        ...memory.download_events,
      ].slice(0, 500)
      break
    case 'template_download':
      if (id) {
        memory.template_downloads[id] = (memory.template_downloads[id] || 0) + 1
        memory.download_events = [
          {
            id: `dl-${Date.now()}`,
            type: 'template' as const,
            asset_id: id,
            asset_label: label || TEMPLATE_LABELS[id] || id,
            ip_address: dummyIp,
            path: path || '/templates',
            created_at: new Date().toISOString(),
          },
          ...memory.download_events,
        ].slice(0, 500)
      }
      break
    case 'publication_view':
      if (id) memory.publication_views[id] = (memory.publication_views[id] || 0) + 1
      break
    case 'publication_download':
      if (id) {
        memory.publication_downloads[id] = (memory.publication_downloads[id] || 0) + 1
        memory.download_events = [
          {
            id: `dl-${Date.now()}`,
            type: 'publication_pdf' as const,
            asset_id: id,
            asset_label: label || PUBLICATION_LABELS[id] || id,
            ip_address: dummyIp,
            path: path || '/publications',
            created_at: new Date().toISOString(),
          },
          ...memory.download_events,
        ].slice(0, 500)
      }
      break
    case 'linkedin_click':
      memory.linkedin_clicks += 1
      break
    case 'github_click':
      memory.github_clicks += 1
      break
    default:
      break
  }

  return memory
}

function snapshotFromState(state: MetricsState, storage: 'supabase' | 'in_memory', note: string) {
  const templateTotal = Object.values(state.template_downloads).reduce((a, b) => a + b, 0)
  const publicationPdfTotal = Object.values(state.publication_downloads).reduce((a, b) => a + b, 0)
  const paperReads = Object.values(state.publication_views).reduce((a, b) => a + b, 0)
  const totalDownloads = state.resume_downloads + templateTotal + publicationPdfTotal

  return {
    summary: {
      portfolio_visits: state.website_visits,
      monthly_visits: state.monthly_visits,
      unique_visitors: state.unique_visitors,
      page_views_total: Object.values(state.page_views).reduce((a, b) => a + b, 0),
      resume_downloads: state.resume_downloads,
      template_downloads: templateTotal,
      publication_pdf_downloads: publicationPdfTotal,
      paper_reads: paperReads,
      total_downloads: totalDownloads,
      linkedin_clicks: state.linkedin_clicks,
      github_clicks: state.github_clicks,
    },
    page_views: state.page_views,
    template_downloads: state.template_downloads,
    publication_views: state.publication_views,
    publication_downloads: state.publication_downloads,
    download_events: state.download_events,
    visit_events: state.visit_events.slice(0, 100),
    storage,
    note,
  }
}

function mapStateFromParts(input: {
  site_stats?: {
    total_visits?: number
    monthly_visits?: number
    unique_visitors?: number
  } | null
  metrics: { metric_name: string; metric_value: number | string }[]
  templates: { id: string; download_count: number }[]
  publications: { id: string; view_count: number; download_count: number }[]
  download_events?: any[]
  site_visits?: any[]
  keepEventsFromMemory?: boolean
}): MetricsState {
  const metricMap = Object.fromEntries(
    (input.metrics || []).map((row) => [row.metric_name, Number(row.metric_value)])
  )

  const page_views: Record<string, number> = {}
  for (const [name, value] of Object.entries(metricMap)) {
    if (name.startsWith('page_view:')) {
      page_views[name.replace('page_view:', '')] = Number(value)
    }
  }

  const template_downloads: Record<string, number> = {}
  for (const row of input.templates || []) {
    template_downloads[row.id] = row.download_count
  }

  const publication_views: Record<string, number> = {}
  const publication_downloads: Record<string, number> = {}
  for (const row of input.publications || []) {
    publication_views[row.id] = row.view_count
    publication_downloads[row.id] = row.download_count
  }

  const download_events: DownloadEvent[] = input.keepEventsFromMemory
    ? memory.download_events
    : (input.download_events || []).map((row) => ({
        id: row.id,
        type: row.event_type as DownloadEventType,
        asset_id: row.asset_id,
        asset_label: row.asset_label,
        ip_address: row.ip_address || '0.0.0.0',
        path: row.path || undefined,
        created_at: row.created_at,
      }))

  const visit_events: VisitEvent[] = input.keepEventsFromMemory
    ? memory.visit_events
    : (input.site_visits || []).map((row) => ({
        id: row.id,
        path: row.page,
        ip_address: row.ip_address || '0.0.0.0',
        created_at: row.visited_at,
      }))

  const siteStats = input.site_stats
  return {
    website_visits: Number(siteStats?.total_visits ?? metricMap.website_visits) || 0,
    monthly_visits: Number(siteStats?.monthly_visits) || 0,
    unique_visitors: Number(siteStats?.unique_visitors ?? metricMap.unique_visitors) || 0,
    page_views,
    resume_downloads: metricMap.resume_downloads || 0,
    template_downloads,
    publication_views,
    publication_downloads,
    linkedin_clicks: metricMap.linkedin_clicks || 0,
    github_clicks: metricMap.github_clicks || 0,
    download_events,
    visit_events,
  }
}

async function loadViaRpc(includeEvents: boolean): Promise<MetricsState | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.rpc('get_portfolio_analytics')
  if (error || !data) return null

  const payload = data as {
    site_stats?: {
      total_visits?: number
      monthly_visits?: number
      unique_visitors?: number
    }
    site_metrics?: { metric_name: string; metric_value: number }[]
    templates?: { id: string; download_count: number }[]
    publications?: { id: string; view_count: number; download_count: number }[]
    download_events?: any[]
    site_visits?: any[]
  }

  return mapStateFromParts({
    site_stats: payload.site_stats || null,
    metrics: payload.site_metrics || [],
    templates: payload.templates || [],
    publications: payload.publications || [],
    download_events: includeEvents ? payload.download_events || [] : undefined,
    site_visits: includeEvents ? payload.site_visits || [] : undefined,
    keepEventsFromMemory: !includeEvents,
  })
}

async function loadViaSequentialQueries(includeEvents: boolean): Promise<MetricsState | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  // Sequential on purpose: parallel requests stack latency and trip the timeout.
  const statsRes = await supabase
    .from('site_stats')
    .select('total_visits, monthly_visits, unique_visitors')
    .eq('id', 'global')
    .maybeSingle()

  const metricsRes = await supabase.from('site_metrics').select('metric_name, metric_value')
  if (metricsRes.error) throw metricsRes.error

  const templatesRes = await supabase.from('templates').select('id, download_count')
  if (templatesRes.error) throw templatesRes.error

  const pubsRes = await supabase.from('publications').select('id, view_count, download_count')
  if (pubsRes.error) throw pubsRes.error

  let downloadRows: any[] | undefined
  let visitRows: any[] | undefined

  if (includeEvents) {
    const downloadsRes = await supabase
      .from('download_events')
      .select('id, event_type, asset_id, asset_label, ip_address, path, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
    if (!downloadsRes.error) downloadRows = downloadsRes.data || []

    const visitsRes = await supabase
      .from('site_visits')
      .select('id, page, ip_address, visited_at')
      .order('visited_at', { ascending: false })
      .limit(100)
    if (!visitsRes.error) visitRows = visitsRes.data || []
  }

  return mapStateFromParts({
    site_stats: statsRes.error ? null : statsRes.data,
    metrics: metricsRes.data || [],
    templates: templatesRes.data || [],
    publications: pubsRes.data || [],
    download_events: downloadRows,
    site_visits: visitRows,
    keepEventsFromMemory: !includeEvents || downloadRows === undefined,
  })
}

async function loadFromSupabase(options: { includeEvents?: boolean } = {}): Promise<MetricsState | null> {
  const includeEvents = options.includeEvents ?? false
  if (isCircuitOpen()) return null

  const supabase = getSupabase()
  if (!supabase) return null

  if (loadInFlight && loadInFlightKey === (includeEvents ? 'full' : 'core')) {
    return loadInFlight
  }

  loadInFlightKey = includeEvents ? 'full' : 'core'
  loadInFlight = (async () => {
    try {
      const viaRpc = await loadViaRpc(includeEvents)
      if (viaRpc) {
        closeCircuit()
        return viaRpc
      }

      const viaQueries = await loadViaSequentialQueries(includeEvents)
      if (viaQueries) {
        closeCircuit()
        return viaQueries
      }

      openCircuit()
      return null
    } catch (err) {
      console.warn('[analytics] Supabase load failed', err instanceof Error ? err.message : err)
      openCircuit()
      return null
    }
  })().finally(() => {
    loadInFlight = null
    loadInFlightKey = null
  })

  return loadInFlight
}

export async function getMetrics(): Promise<ReturnType<typeof toPublicMetrics>> {
  if (isSupabaseConfigured()) {
    const remote = await loadFromSupabase({ includeEvents: false })
    if (remote) {
      memory = { ...remote, download_events: memory.download_events, visit_events: memory.visit_events }
      return toPublicMetrics(remote)
    }
  }
  return toPublicMetrics(memory)
}

export async function getAdminSnapshot() {
  resetSupabaseCircuit()

  if (isSupabaseConfigured()) {
    const remote = await loadFromSupabase({ includeEvents: true })
    if (remote) {
      memory = remote
      return snapshotFromState(
        remote,
        'supabase',
        'Connected to Supabase. Visits use session + unique counters; template totals include real clicks and the hourly drip (~2/hour).'
      )
    }
  }

  const note = isCircuitOpen()
    ? 'Supabase timed out recently - showing cached/in-memory metrics until the connection recovers.'
    : 'Using in-memory fallback. Confirm network access to Supabase, then refresh.'

  return snapshotFromState(memory, 'in_memory', note)
}

export async function trackEvent(
  eventType: string,
  options: { id?: string; path?: string; ip_address?: string; label?: string } = {}
) {
  const dummyIp = options.ip_address || generateDummyIp()
  const supabase = getSupabase()

  if (supabase && !isCircuitOpen()) {
    try {
      const { error } = await supabase.rpc('track_portfolio_event', {
        p_event: eventType,
        p_id: options.id ?? null,
        p_path: options.path ?? null,
        p_label: options.label ?? null,
        p_ip: dummyIp,
      })

      if (!error) {
        closeCircuit()
        const remote = await loadFromSupabase({ includeEvents: false })
        if (remote) {
          memory = {
            ...remote,
            download_events: memory.download_events,
            visit_events: memory.visit_events,
          }
          return toPublicMetrics(memory)
        }
      } else {
        openCircuit()
      }
    } catch {
      openCircuit()
    }
  }

  return toPublicMetrics(trackEventMemory(eventType, { ...options, ip_address: dummyIp }))
}
