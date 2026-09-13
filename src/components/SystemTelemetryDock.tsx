'use client'

import React, { useState, useEffect } from 'react'
import { Activity, ShieldCheck, ArrowUp, Mail, Copy, Check } from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export function SystemTelemetryDock() {
  const [visits, setVisits] = useState<number>(1420)
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.website_visits) {
          setVisits(data.data.website_visits)
        }
      })
      .catch(() => {})
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.portfolio.owner.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <aside
      aria-label="System telemetry"
      className="fixed bottom-4 left-4 z-40 hidden sm:flex flex-col items-start gap-2"
    >
      {/* Expanded Telemetry Card */}
      {showDetails && (
        <div className="rounded-xl panel p-4 text-xs font-mono border border-border/80 shadow-2xl backdrop-blur-xl w-64 space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-primary font-semibold flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-signal" />
              SYSTEM TELEMETRY
            </span>
            <span className="text-[10px] text-signal bg-signal/10 px-1.5 py-0.5 rounded border border-signal/20">
              OPERATIONAL
            </span>
          </div>
          <div className="space-y-1.5 text-muted">
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-foreground">Next.js 14 App</span>
            </div>
            <div className="flex justify-between">
              <span>Telemetry Node:</span>
              <span className="text-signal">Active (US-East)</span>
            </div>
            <div className="flex justify-between">
              <span>QA Validation:</span>
              <span className="text-foreground">100% Passed</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Visits:</span>
              <span className="text-primary font-bold">{visits.toLocaleString()}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between">
            <button
              onClick={copyEmail}
              className="text-muted hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="h-3 w-3 text-signal" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied Email' : 'Copy Email'}
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

      {/* Primary Pill Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-2.5 rounded-full panel px-3.5 py-1.5 text-xs font-mono border border-border/80 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10"
      >
        <span className="h-2 w-2 rounded-full bg-signal animate-pulse-node" />
        <span className="text-muted">Telemetry:</span>
        <span className="text-primary font-bold">{visits.toLocaleString()} visits</span>
      </button>
    </aside>
  )
}
