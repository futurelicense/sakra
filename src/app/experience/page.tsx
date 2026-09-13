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
  Terminal,
  Cpu,
  Layers
} from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export default function ExperiencePage() {
  const { experience } = portfolioData.portfolio
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Extract all unique categories
  const allCategories = ['All', ...Array.from(new Set(experience.roles.flatMap((r) => r.category)))]

  const filteredRoles =
    selectedCategory === 'All'
      ? experience.roles
      : experience.roles.filter((r) => r.category.includes(selectedCategory))

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-5xl mx-auto px-5 md:px-8 space-y-12">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          Career Progression & Roles
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {experience.page_title}
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {experience.page_subtitle}
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-primary shrink-0 ml-1" />
        {allCategories.map((cat) => (
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

      {/* Roles Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent before:hidden md:before:block">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="rounded-2xl panel p-6 sm:p-8 lg:p-9 hover:panel-glow relative md:ml-16 transition-all"
          >
            {/* Timeline node icon */}
            <div className="hidden md:flex absolute -left-[4.25rem] top-8 w-8 h-8 rounded-full bg-panel border border-primary/50 text-primary items-center justify-center shadow-lg ring-4 ring-background">
              <Briefcase className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-border/70 pb-6">
              <div>
                <span className="eyebrow block">
                  {role.company}
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground mt-1">
                  {role.role}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-muted">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {role.start_date} — {role.end_date || 'Present'}
                  </span>
                  {role.location && (
                    <span className="flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-energy" />
                      {role.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Category Badges */}
              <div className="flex flex-wrap gap-1.5">
                {role.category.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-white/[0.04] border border-border text-muted"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-base text-foreground/90 leading-relaxed font-normal">
              {role.summary}
            </p>

            {/* Key quantified metrics */}
            {role.metrics && role.metrics.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.02] border border-border/60">
                {role.metrics.map((m) => (
                  <div key={m.label} className="text-center sm:text-left">
                    <div className="font-display text-2xl sm:text-3xl font-bold text-primary font-mono">
                      {m.value}{m.suffix}
                    </div>
                    <div className="text-xs text-muted font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Key Deliverables */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-dark">
                Key Responsibilities & Deliverables
              </h3>
              <ul className="space-y-2.5">
                {role.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
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
