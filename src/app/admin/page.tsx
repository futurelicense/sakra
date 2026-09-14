'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  Download,
  FileText,
  Lock,
  LogOut,
  RefreshCw,
  Shield,
  BookOpen,
  Globe,
  LayoutTemplate,
  User,
} from 'lucide-react'

const STORAGE_KEY = 'sakera_admin_token'

type AdminSnapshot = {
  summary: {
    portfolio_visits: number
    monthly_visits: number
    unique_visitors: number
    page_views_total: number
    resume_downloads: number
    template_downloads: number
    publication_pdf_downloads: number
    paper_reads: number
    total_downloads: number
    linkedin_clicks: number
    github_clicks: number
  }
  page_views: Record<string, number>
  template_downloads: Record<string, number>
  publication_views: Record<string, number>
  publication_downloads: Record<string, number>
  download_events: {
    id: string
    type: string
    asset_id: string
    asset_label: string
    ip_address: string
    path?: string
    created_at: string
  }[]
  storage: string
  note: string
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminDashboardPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AdminSnapshot | null>(null)
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) setAdminToken(saved)
  }, [])

  const fetchMetrics = useCallback(async (token: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { 'x-admin-token': token },
        cache: 'no-store',
      })
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY)
          setAdminToken(null)
          setAuthError('Invalid credentials')
        }
        return
      }
      const json = await res.json()
      setData(json.data)
      setRefreshedAt(json.refreshed_at)
      setAuthError(null)
    } catch {
      setAuthError('Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!adminToken) return
    fetchMetrics(adminToken)
  }, [adminToken, fetchMetrics])

  useEffect(() => {
    if (!adminToken || !autoRefresh) return
    const timer = setInterval(() => fetchMetrics(adminToken), 10000)
    return () => clearInterval(timer)
  }, [adminToken, autoRefresh, fetchMetrics])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })
      if (!res.ok) {
        setAuthError('Invalid username or password')
        return
      }
      const json = await res.json()
      sessionStorage.setItem(STORAGE_KEY, json.token)
      setAdminToken(json.token)
    } catch {
      setAuthError('Could not authenticate')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setAdminToken(null)
    setData(null)
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5 py-16">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm space-y-5"
        >
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
              <Shield className="h-3.5 w-3.5" />
              Admin
            </span>
            <h1 className="font-display text-2xl font-bold text-foreground">Portfolio analytics</h1>
            <p className="text-sm text-muted leading-relaxed">
              Sign in to view session visits, unique browsers, template downloads (real + drip), and legacy download logs.
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">Username</span>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="field w-full pl-10"
                placeholder="admin"
                autoComplete="username"
                autoFocus
              />
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">Password</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field w-full pl-10"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
          </label>

          {authError && <p className="text-sm text-energy">{authError}</p>}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="btn-signal w-full h-11 rounded-lg text-sm font-semibold uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Open dashboard'}
          </button>
        </form>
      </div>
    )
  }

  const summary = data?.summary

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-signal" />
              <h1 className="font-display text-lg font-bold text-foreground">Analytics dashboard</h1>
            </div>
            <p className="text-xs text-muted font-mono mt-0.5">
              {data?.storage === 'supabase'
                ? 'Supabase'
                : data?.storage === 'supabase_cached'
                  ? 'Cached Supabase'
                  : 'In-memory'}
              {refreshedAt ? ` · Updated ${formatTime(refreshedAt)}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-xs text-muted px-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-border"
              />
              Auto-refresh 10s
            </label>
            <button
              onClick={() => adminToken && fetchMetrics(adminToken)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-muted hover:text-primary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-muted hover:text-energy"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 md:px-8 py-8 space-y-8">
        {data?.note && (
          <p className="text-xs sm:text-sm rounded-xl border border-primary/20 bg-primary/5 text-muted px-4 py-3">
            {data.note}
          </p>
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Globe} label="Total visits (sessions)" value={summary?.portfolio_visits} />
          <StatCard icon={Activity} label="Monthly visits" value={summary?.monthly_visits} />
          <StatCard icon={User} label="Unique visitors" value={summary?.unique_visitors} />
          <StatCard icon={LayoutTemplate} label="Template downloads" value={summary?.template_downloads} />
          <StatCard icon={Download} label="All downloads" value={summary?.total_downloads} />
          <StatCard icon={FileText} label="Resume / PDF downloads" value={summary?.resume_downloads} />
          <StatCard icon={BookOpen} label="Paper reads" value={summary?.paper_reads} />
          <StatCard icon={FileText} label="Publication PDFs" value={summary?.publication_pdf_downloads} />
        </section>

        <section className="grid lg:grid-cols-2 gap-5">
          <BreakdownCard
            title="Template downloads (real clicks + hourly drip)"
            rows={Object.entries(data?.template_downloads || {}).map(([k, v]) => ({ label: k, value: v }))}
          />
          <BreakdownCard
            title="Legacy page-view counters"
            rows={Object.entries(data?.page_views || {}).map(([k, v]) => ({ label: k, value: v }))}
          />
          <BreakdownCard
            title="Paper reads (publication views)"
            rows={Object.entries(data?.publication_views || {}).map(([k, v]) => ({ label: k, value: v }))}
          />
          <BreakdownCard
            title="Publication PDF downloads"
            rows={Object.entries(data?.publication_downloads || {}).map(([k, v]) => ({ label: k, value: v }))}
          />
        </section>

        <section className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Legacy download activity</h2>
              <p className="text-xs text-muted mt-0.5">
                Resume and publication PDF events (template totals now live on the templates table / drip job).
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {data?.download_events?.length || 0} events
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-mono uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium">IP address</th>
                  <th className="px-4 py-3 font-medium">Path</th>
                </tr>
              </thead>
              <tbody>
                {(data?.download_events || []).map((event) => (
                  <tr key={event.id} className="border-t border-border/70 hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{formatTime(event.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded bg-slate-100 border border-border px-2 py-0.5 text-xs font-mono">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">{event.asset_label}</td>
                    <td className="px-4 py-3 font-mono text-primary whitespace-nowrap">{event.ip_address}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{event.path || '-'}</td>
                  </tr>
                ))}
                {!data?.download_events?.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted">
                      No downloads logged yet. Trigger a resume, template, or PDF download on the site.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: number
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2 text-muted mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
        {(value ?? 0).toLocaleString()}
      </div>
    </div>
  )
}

function BreakdownCard({
  title,
  rows,
}: {
  title: string
  rows: { label: string; value: number }[]
}) {
  const sorted = [...rows].sort((a, b) => b.value - a.value)
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h3 className="font-display text-base font-bold text-foreground mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {sorted.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="font-mono text-xs text-muted truncate">{row.label}</span>
            <span className="font-mono font-semibold text-primary tabular-nums">{row.value.toLocaleString()}</span>
          </li>
        ))}
        {!sorted.length && <li className="text-sm text-muted">No data yet</li>}
      </ul>
    </div>
  )
}
