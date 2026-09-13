'use client'

import { useState } from 'react'
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Filter,
  ShieldCheck,
  Database,
  Users,
  ChevronRight
} from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export default function ExperiencePage() {
  const { experience } = portfolioData.portfolio
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Extract all unique categories
  const allCategories = ['All', ...Array.from(new Set(experience.roles.flatMap(r => r.category)))]

  const filteredRoles = selectedCategory === 'All'
    ? experience.roles
    : experience.roles.filter(r => r.category.includes(selectedCategory))

  return (
    <div className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
          Career Timeline
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          {experience.page_title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {experience.page_subtitle}
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Roles Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-gray-200 before:hidden md:before:block">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm hover-lift relative md:ml-16 transition-all"
          >
            {/* Timeline icon */}
            <div className="hidden md:flex absolute -left-[4.25rem] top-8 w-9 h-9 rounded-full bg-blue-600 text-white items-center justify-center shadow-md ring-4 ring-white">
              <Briefcase className="w-4 h-4" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                  {role.company}
                </span>
                <h2 className="text-2xl font-bold text-gray-950 mt-2">
                  {role.role}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {role.start_date} — {role.end_date || 'Present'}
                  </span>
                  {role.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {role.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {role.category.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-medium px-2.5 py-1 rounded bg-gray-100 text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-base text-gray-700 leading-relaxed font-normal">
              {role.summary}
            </p>

            {/* Role Key Metrics */}
            {role.metrics && role.metrics.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                {role.metrics.map((m) => (
                  <div key={m.label} className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                      {m.value}{m.suffix}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Responsibilities list */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Key Responsibilities & Deliverables
              </h3>
              <ul className="space-y-2.5">
                {role.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
