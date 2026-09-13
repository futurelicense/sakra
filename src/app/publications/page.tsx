'use client'

import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Search,
  Eye,
  Award,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export default function PublicationsPage() {
  const { publications } = portfolioData.portfolio
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [downloadCounters, setDownloadCounters] = useState<Record<string, number>>({})

  const handleDownload = (pubId: string, pdfUrl: string) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'publication_download',
        id: pubId
      })
    }).catch(() => {})

    setDownloadCounters((prev) => ({
      ...prev,
      [pubId]: (prev[pubId] || 0) + 1
    }))
  }

  const handleView = (pubId: string) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'publication_view',
        id: pubId
      })
    }).catch(() => {})
  }

  const filteredItems = publications.items.filter((item) => {
    const matchesCat =
      selectedCategory === 'All Categories' || item.publication_type === selectedCategory
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-5xl mx-auto px-5 md:px-8 space-y-12">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          Academic & Applied Research
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {publications.page_title}
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {publications.page_subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {publications.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20'
                  : 'bg-white/[0.04] text-muted hover:text-foreground hover:bg-white/[0.08] border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search papers, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/[0.03] border border-border rounded-lg text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 rounded-2xl panel">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">No publications found</h3>
            <p className="text-sm text-muted mt-1">Try refining your search query or selecting another category.</p>
          </div>
        ) : (
          filteredItems.map((pub) => {
            const addedDownloads = downloadCounters[pub.id] || 0
            const totalDownloads = pub.downloads + addedDownloads

            return (
              <div
                key={pub.id}
                className="rounded-2xl panel p-6 sm:p-8 hover:panel-glow transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {pub.publication_type}
                      </span>
                      <span className="text-xs font-mono text-muted flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-muted" />
                        {pub.year}
                      </span>
                      {pub.featured && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-energy/10 text-energy border border-energy/30 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Featured Paper
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-snug">
                      {pub.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted">
                      Authors: <span className="text-foreground font-medium">{pub.authors.join(', ')}</span> · <span className="italic text-muted">{pub.journal_or_conference}</span>
                    </p>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 text-xs font-mono text-muted shrink-0">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      {pub.views} Views
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-signal">
                      <Download className="w-3.5 h-3.5" />
                      {totalDownloads} Downloads
                    </span>
                  </div>
                </div>

                {/* Abstract box */}
                <div className="text-sm text-muted leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-border/60">
                  <strong className="text-foreground block mb-1 text-xs font-mono uppercase tracking-wider">
                    Abstract
                  </strong>
                  {pub.abstract}
                </div>

                {/* Tags & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
                  <div className="flex flex-wrap gap-1.5">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] text-muted border border-border/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {pub.external_url && (
                      <a
                        href={pub.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleView(pub.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary bg-white/[0.03] border border-border hover:border-primary/40 px-3 py-2 rounded-lg transition-colors"
                      >
                        <span>View DOI / Source</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={pub.pdf_url}
                      download
                      onClick={() => handleDownload(pub.id, pub.pdf_url)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg btn-signal px-4 py-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
