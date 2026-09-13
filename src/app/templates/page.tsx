'use client'

import { useState, useEffect } from 'react'
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Filter,
  Layers,
  ArrowDownToLine,
  Search,
  Sparkles
} from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export default function TemplatesPage() {
  const { free_templates } = portfolioData.portfolio
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [counters, setCounters] = useState<Record<string, number>>({})
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.template_downloads) {
          setCounters(data.data.template_downloads)
        }
      })
      .catch(() => {})
  }, [])

  const categories = ['All', 'Software Quality Assurance', 'Data Analytics']

  const handleDownload = async (templateId: string, fileUrl: string, title: string) => {
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'template_download',
          id: templateId
        })
      })
      const data = await res.json()
      if (data?.data?.template_downloads) {
        setCounters(data.data.template_downloads)
      }

      setDownloadSuccess(title)
      setTimeout(() => setDownloadSuccess(null), 4000)
    } catch {
      setCounters((prev) => ({
        ...prev,
        [templateId]: (prev[templateId] || 0) + 1
      }))
    }
  }

  const filteredTemplates = free_templates.templates.filter((tmpl) => {
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory
    const matchesQuery =
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.includes.some((inc) => inc.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  // Calculate live total downloads
  const totalDownloads = free_templates.templates.reduce((acc, curr) => {
    return acc + (counters[curr.id] || curr.download_count)
  }, 0)

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-5xl mx-auto px-5 md:px-8 space-y-12">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-panel border border-signal text-foreground px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in backdrop-blur-xl">
          <CheckCircle2 className="w-5 h-5 text-signal" />
          <span className="text-sm">Downloaded: <strong className="text-primary">{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Page Header */}
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

        {/* Aggregate Download Counter Card */}
        <div className="rounded-2xl panel p-5 shrink-0 text-center lg:text-right">
          <div className="text-xs font-mono uppercase tracking-wider text-muted">
            Total Community Downloads
          </div>
          <div className="font-display text-3xl sm:text-4xl font-bold text-signal font-mono mt-0.5">
            {totalDownloads.toLocaleString()}+
          </div>
          <div className="text-[11px] text-muted mt-1 flex items-center justify-center lg:justify-end gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-node" />
            Real-time Verified Counter
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20'
                  : 'bg-white/[0.04] text-muted hover:text-foreground border border-border'
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
            placeholder="Search templates or fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/[0.03] border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const downloadCount = counters[template.id] || template.download_count

          return (
            <article
              key={template.id}
              className="flex flex-col justify-between rounded-2xl panel p-6 sm:p-7 hover:panel-glow space-y-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">
                    {template.format.join(' · ')}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-white/[0.04] border border-border text-muted">
                    {template.category}
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {template.title}
                </h2>

                <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
                  {template.description}
                </p>

                {/* Structured Fields Box */}
                <div className="mt-5 p-4 rounded-xl bg-white/[0.02] border border-border/60">
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

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                <div className="text-xs font-mono text-muted">
                  <span className="font-bold text-primary">
                    {downloadCount.toLocaleString()}
                  </span> downloads
                </div>

                <a
                  href={template.file_url}
                  download
                  onClick={() => handleDownload(template.id, template.file_url, template.title)}
                  className="inline-flex items-center gap-2 rounded-lg btn-signal h-9 px-4 text-xs font-semibold uppercase tracking-wider"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  Download (.xlsx)
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
