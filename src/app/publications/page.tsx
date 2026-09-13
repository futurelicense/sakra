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
  CheckCircle2
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

    setDownloadCounters(prev => ({
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
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  return (
    <div className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold uppercase tracking-wider">
          Scholarly & Applied Research
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          {publications.page_title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
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
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search papers, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-2xl">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">No publications found</h3>
            <p className="text-sm text-gray-500 mt-1">Try refining your search query or selecting another category.</p>
          </div>
        ) : (
          filteredItems.map((pub) => {
            const addedDownloads = downloadCounters[pub.id] || 0
            const totalDownloads = pub.downloads + addedDownloads

            return (
              <div
                key={pub.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover-lift shadow-sm hover:border-purple-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                        {pub.publication_type}
                      </span>
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {pub.year}
                      </span>
                      {pub.featured && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Featured Paper
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                      {pub.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Authors: <span className="text-gray-900">{pub.authors.join(', ')}</span> • <span className="italic">{pub.journal_or_conference}</span>
                    </p>
                  </div>

                  {/* Metrics Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 text-xs text-gray-500 shrink-0">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {pub.views} Views
                    </span>
                    <span className="flex items-center gap-1 font-medium text-purple-600">
                      <Download className="w-3.5 h-3.5" />
                      {totalDownloads} Downloads
                    </span>
                  </div>
                </div>

                {/* Abstract */}
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <strong className="text-gray-900 block mb-1 text-xs uppercase tracking-wider">
                    Abstract
                  </strong>
                  {pub.abstract}
                </div>

                {/* Tags & Action CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1.5">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600"
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-purple-600 bg-white border border-gray-300 hover:border-purple-300 px-3 py-2 rounded-lg transition-colors"
                      >
                        <span>View DOI / Source</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={pub.pdf_url}
                      download
                      onClick={() => handleDownload(pub.id, pub.pdf_url)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
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
