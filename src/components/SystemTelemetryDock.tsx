'use client'

import { useState, useEffect } from 'react'
import { Activity, ArrowUp, Copy, Check } from 'lucide-react'
import { useLiveMetrics } from '@/hooks/useLiveMetrics'
import portfolioData from '@/data/portfolio'

export function SystemTelemetryDock() {
  const { visits } = useLiveMetrics({ intervalMs: 15000 })
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (!showDetails) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDetails(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showDetails])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.portfolio.owner.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside
      aria-label="System telemetry"
      className="fixed bottom-4 left-4 z-40 hidden md:flex flex-col items-start gap-2"
    >
      {showDetails && (
        <div className="rounded-xl panel p-3.5 text-xs font-mono w-60 space-y-2.5 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-primary font-semibold flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-signal" />
              Telemetry
            </span>
            <span className="text-[10px] text-signal bg-signal/10 px-1.5 py-0.5 rounded border border-signal/20">
              Live
            </span>
          </div>
          <div className="space-y-1.5 text-muted">
            <div className="flex justify-between gap-3">
              <span>Visits</span>
              <span className="text-primary font-bold tabular-nums">
                {visits === null ? '—' : visits.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Status</span>
              <span className="text-signal">Operational</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <button
              onClick={copyEmail}
              className="text-muted hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="h-3 w-3 text-signal" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Email'}
            </button>
            <button
              onClick={scrollToTop}
              className="text-muted hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
            >
              <ArrowUp className="h-3 w-3" />
              Top
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
        className="inline-flex items-center gap-2 rounded-full panel px-3 py-1.5 text-xs font-mono hover:border-primary/40 transition-all"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
        <span className="text-muted hidden lg:inline">Visits</span>
        <span className="text-primary font-bold tabular-nums">
          {visits === null ? '—' : visits.toLocaleString()}
        </span>
      </button>
    </aside>
  )
}
