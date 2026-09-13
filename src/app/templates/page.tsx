'use client'

import { useState, useEffect } from 'react'
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers,
  ArrowDownToLine,
  Search,
  ExternalLink
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
      // Send download event to server API
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
      // Fallback local update
      setCounters(prev => ({
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
      tmpl.includes.some(inc => inc.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  // Calculate live total downloads
  const totalDownloads = free_templates.templates.reduce((acc, curr) => {
    return acc + (counters[curr.id] || curr.download_count)
  }, 0)

  return (
    <div className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Downloaded: <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            Free Community Resources
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            {free_templates.page_title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {free_templates.page_subtitle}
          </p>
        </div>

        {/* Global Aggregate Download Counter */}
        <div className="bg-gradient-to-tr from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-2xl p-5 shrink-0 text-center lg:text-right shadow-sm">
          <div className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
            Total Community Downloads
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-0.5">
            {totalDownloads.toLocaleString()}+
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center justify-center lg:justify-end gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates or columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredTemplates.map((template) => {
          const downloadCount = counters[template.id] || template.download_count

          return (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover-lift shadow-sm hover:border-emerald-300 transition-all space-y-6"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {template.category}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                    {template.format.join(' & ')}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {template.title}
                </h2>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {template.description}
                </p>

                {/* Structured Columns / Included Features */}
                <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    Structured Fields Included:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {template.includes.map((inc) => (
                      <div key={inc} className="flex items-center gap-1.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Live Counter */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-emerald-600 text-sm">
                    {downloadCount.toLocaleString()}
                  </span> downloads
                </div>

                <a
                  href={template.file_url}
                  download
                  onClick={() => handleDownload(template.id, template.file_url, template.title)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  Download Spreadsheet (.xlsx)
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
