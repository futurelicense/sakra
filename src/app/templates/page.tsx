'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2,
  Layers,
  ArrowDownToLine,
  Search,
  Eye
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { TemplatePreviewModal, TemplatePreviewData } from '@/components/TemplatePreviewModal'
import { useLiveMetrics } from '@/hooks/useLiveMetrics'
import { isResourceTemplateId } from '@/lib/templateIds'
import { registerDownload, triggerFileDownload } from '@/lib/stats'
import portfolioData from '@/data/portfolio'

function formatCount(value: number | null | undefined) {
  if (typeof value !== 'number') return '—'
  return value.toLocaleString()
}

export default function TemplatesPage() {
  const { free_templates } = portfolioData.portfolio
  const { visits, templateDownloads, loading, error, refresh } = useLiveMetrics()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [localCounters, setLocalCounters] = useState<Record<string, number> | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreviewData | null>(null)
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    if (templateDownloads) setLocalCounters(templateDownloads)
  }, [templateDownloads])

  const counters = localCounters
  const hasLiveCounts =
    counters != null &&
    free_templates.templates.some((t) => typeof counters[t.id] === 'number')

  const countFor = useCallback(
    (templateId: string, fallback?: number) => {
      if (counters && typeof counters[templateId] === 'number') return counters[templateId]
      if (typeof fallback === 'number') return fallback
      return null
    },
    [counters]
  )

  const categories = ['All', 'Software Quality Assurance', 'Data Analytics']

  const handleDownload = async (templateId: string, fileUrl: string, title: string) => {
    triggerFileDownload(fileUrl)

    setLocalCounters((prev) => {
      const base = prev ?? {}
      const current =
        typeof base[templateId] === 'number'
          ? base[templateId]
          : free_templates.templates.find((t) => t.id === templateId)?.download_count ?? 0
      return { ...base, [templateId]: current + 1 }
    })

    if (isResourceTemplateId(templateId)) {
      try {
        const next = await registerDownload(templateId)
        if (next > 0) {
          setLocalCounters((prev) => ({ ...(prev ?? {}), [templateId]: next }))
        }
      } catch {
        await refresh()
      }
    }

    setDownloadSuccessToast(title)
    setTimeout(() => setDownloadSuccessToast(null), 4000)
  }

  const filteredTemplates = free_templates.templates.filter((tmpl) => {
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory
    const matchesQuery =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.includes.some((inc) => inc.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  const totalDownloads = free_templates.templates.reduce((acc, curr) => {
    return acc + (countFor(curr.id, curr.download_count) ?? 0)
  }, 0)

  const statusLabel = hasLiveCounts && !error
    ? 'Live counts'
    : loading
      ? 'Loading counts...'
      : null

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-5xl mx-auto px-5 md:px-8 space-y-12">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      <TemplatePreviewModal
        template={
          previewTemplate
            ? {
                ...previewTemplate,
                download_count:
                  countFor(previewTemplate.id, previewTemplate.download_count) ?? 0,
              }
            : null
        }
        onClose={() => setPreviewTemplate(null)}
        onDownload={handleDownload}
      />

      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-panel border border-signal text-foreground px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in backdrop-blur-xl">
          <CheckCircle2 className="w-5 h-5 text-signal" />
          <span className="text-sm">
            Downloaded: <strong className="text-primary">{downloadSuccessToast}</strong>
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border/70 pb-8">
        <div className="max-w-3xl space-y-4">
          <span className="eyebrow inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
            Free Community Resources
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {free_templates.page_title}
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {free_templates.page_subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <div className="rounded-2xl panel p-5 text-center lg:text-right font-mono">
            <div className="text-xs uppercase tracking-wider text-muted">Total Community Downloads</div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-signal mt-0.5">
              <AnimatedCounter value={totalDownloads} suffix="+" />
            </div>
            {statusLabel && (
              <div className="text-[11px] text-muted mt-1 flex items-center justify-center lg:justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-node" />
                {statusLabel}
              </div>
            )}
          </div>

          <div className="rounded-2xl panel p-5 text-center lg:text-right font-mono">
            <div className="text-xs uppercase tracking-wider text-muted flex items-center justify-center lg:justify-end gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              Portfolio Views
            </div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-primary mt-0.5">
              {typeof visits === 'number' ? (
                <AnimatedCounter value={visits} />
              ) : (
                '—'
              )}
            </div>
            <div className="text-[11px] text-muted mt-1 flex items-center justify-center lg:justify-end gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-node" />
              {typeof visits === 'number' ? 'Live session visits' : 'Loading views...'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-slate-100 text-muted hover:text-foreground border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates or columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-border rounded-lg text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const downloadCount = countFor(template.id, template.download_count)

          return (
            <TiltCard key={template.id} className="p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">
                    {template.format.join(' · ')}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-100 border border-border text-muted">
                    {template.category}
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {template.title}
                </h2>

                <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
                  {template.description}
                </p>

                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-border/60">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-dark mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    Structured Worksheet Columns:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {template.includes.map((inc) => (
                      <div key={inc} className="flex items-center gap-1.5 text-xs text-muted">
                        <CheckCircle2 className="w-3.5 h-3.5 text-signal shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                <div className="text-xs font-mono text-muted">
                  <span className="font-bold text-primary">{formatCount(downloadCount)}</span> downloads
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(template as TemplatePreviewData)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-slate-100 px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(template.id, template.file_url, template.title)}
                    className="inline-flex items-center gap-1.5 rounded-lg btn-signal h-8 px-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
            </TiltCard>
          )
        })}
      </div>
    </div>
  )
}
