'use client'

import { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Search,
  Award,
  Quote,
  Cpu
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { CitationModal, PublicationCitationData } from '@/components/CitationModal'
import portfolioData from '@/data/portfolio'

export default function PublicationsPage() {
  const { publications } = portfolioData.portfolio
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeCitationPub, setActiveCitationPub] = useState<PublicationCitationData | null>(null)

  const handleDownload = (pubId: string) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'publication_download',
        id: pubId,
        path: '/publications',
      }),
    }).catch(() => {})
  }

  const handleView = (pubId: string) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'publication_view',
        id: pubId,
        path: '/publications',
      }),
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
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      <CitationModal
        publication={activeCitationPub}
        onClose={() => setActiveCitationPub(null)}
      />

      <div className="border-b border-border/70 pb-8">
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
      </div>

      <TiltCard className="p-6 md:p-8 border-primary/30">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Cpu className="h-5 w-5" />
          </span>
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Doctoral Research Focus · DCS · University of the Potomac
            </span>
            <h3 className="font-display text-lg font-bold text-foreground">
              Predictive Analytics, Capital Readiness & Intelligent Systems
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Research portfolio spanning AI-powered capital optimization, cybersecurity readiness in startup ecosystems, predictive financial modelling for SMEs, and national competitiveness in U.S. small-business financing.
            </p>
          </div>
        </div>
      </TiltCard>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {publications.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-slate-100 text-muted hover:text-foreground hover:bg-slate-100 border border-border'
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
            placeholder="Search papers, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-border rounded-lg text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 rounded-2xl panel">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">No publications found</h3>
            <p className="text-sm text-muted mt-1 max-w-md mx-auto">
              Try refining your search query or selecting another category.
            </p>
          </div>
        ) : (
          filteredItems.map((pub) => (
            <TiltCard key={pub.id} className="p-6 sm:p-8 space-y-4">
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

              <div className="text-sm text-muted leading-relaxed bg-slate-50 p-4 rounded-xl border border-border/60">
                <strong className="text-foreground block mb-1 text-xs font-mono uppercase tracking-wider">
                  Abstract
                </strong>
                {pub.abstract}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
                <div className="flex flex-wrap gap-1.5">
                  {pub.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-muted border border-border/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveCitationPub(pub as PublicationCitationData)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground bg-slate-100 border border-border px-3 py-2 rounded-lg transition-colors"
                  >
                    <Quote className="h-3.5 w-3.5 text-primary" />
                    <span>Cite</span>
                  </button>

                  {pub.external_url && (
                    <a
                      href={pub.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleView(pub.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary bg-white border border-border hover:border-primary/40 px-3 py-2 rounded-lg transition-colors"
                    >
                      <span>Publisher / DOI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {pub.pdf_url && (
                    <a
                      href={pub.pdf_url}
                      download
                      onClick={() => handleDownload(pub.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg btn-signal px-4 py-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          ))
        )}
      </div>
    </div>
  )
}
