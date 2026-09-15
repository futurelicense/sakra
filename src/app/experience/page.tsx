'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import portfolioData from '@/data/portfolio.json'

export default function ExperiencePage() {
  const { experience, home } = portfolioData.portfolio
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    'upskill-consultancy': true,
    'data-analyst': true,
    'wust-it-assistant': false,
    'british-ielts-hr': false
  })
  const featuredWork = experience.featured_work ?? []

  const metricById = Object.fromEntries(home.metrics.map((m) => [m.id, m.value]))
  const testCases =
    experience.roles.find((r) => r.id === 'upskill-consultancy')?.metrics.find((m) => m.label === 'Test Cases')
      ?.value ?? metricById.test_cases ?? 0
  const defects =
    experience.roles.find((r) => r.id === 'upskill-consultancy')?.metrics.find((m) => m.label === 'Defects Tracked')
      ?.value ?? 0
  const records =
    experience.roles.find((r) => r.id === 'data-analyst')?.metrics.find((m) =>
      m.label.toLowerCase().includes('record')
    )?.value ?? metricById.data_records ?? 0

  // Extract all unique categories
  const allCategories = ['All', ...Array.from(new Set(experience.roles.flatMap((r) => r.category)))]

  const filteredRoles =
    selectedCategory === 'All'
      ? experience.roles
      : experience.roles.filter((r) => r.category.includes(selectedCategory))

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId]
    }))
  }

  return (
    <div className="relative overflow-hidden py-28 md:py-32 max-w-5xl mx-auto px-5 md:px-8 space-y-10">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.28] -z-10" />

      <div className="max-w-3xl space-y-3">
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          Career Progression
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
          {experience.page_title}
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
          {experience.page_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl panel">
        <div className="space-y-0.5">
          <div className="font-display text-2xl sm:text-3xl font-bold text-signal tabular-nums">
            <AnimatedCounter value={testCases} suffix="+" />
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-muted uppercase tracking-wider">
            Test Cases
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="font-display text-2xl sm:text-3xl font-bold text-primary tabular-nums">
            <AnimatedCounter value={defects} suffix="+" />
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-muted uppercase tracking-wider">
            Defects
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="font-display text-2xl sm:text-3xl font-bold text-energy tabular-nums">
            <AnimatedCounter value={records} suffix="+" />
          </div>
          <div className="text-[10px] sm:text-xs font-mono text-muted uppercase tracking-wider">
            Records
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-primary shrink-0 ml-1" />
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'btn-quiet'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Roles Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent before:hidden md:before:block">
        {filteredRoles.map((role) => {
          const isExpanded = expandedRoles[role.id] ?? true

          return (
            <div key={role.id} className="relative md:ml-16">
              {/* Timeline node icon */}
              <div className="hidden md:flex absolute -left-[4.25rem] top-8 w-8 h-8 rounded-full bg-panel border border-primary/50 text-primary items-center justify-center shadow-lg ring-4 ring-background z-20">
                <Briefcase className="w-3.5 h-3.5" />
              </div>

              <TiltCard className="p-6 sm:p-8 lg:p-9 transition-all">
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
                        {role.start_date} - {role.end_date || 'Present'}
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
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 border border-border text-muted"
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
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-border/60">
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

                {/* Key Deliverables (Expandable) */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-muted-dark">
                      Key Responsibilities & Deliverables ({role.responsibilities.length})
                    </h3>
                    <button
                      onClick={() => toggleRoleExpansion(role.id)}
                      className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <span>Collapse</span>
                          <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <span>Expand All</span>
                          <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <ul className="space-y-2.5 animate-fade-in pt-1">
                      {role.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </TiltCard>
            </div>
          )
        })}
      </div>

      {featuredWork.length > 0 && (
        <section className="space-y-5 pt-4 border-t border-border/70">
          <div className="space-y-2 max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-node" />
              Featured Work
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Selected product collaborations
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Additional engagements outside formal employment - including startup capital readiness assessment work.
            </p>
          </div>

          <div className="space-y-5">
            {featuredWork.map((item) => (
              <TiltCard key={item.id} className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border/70 pb-5">
                  <div>
                    <span className="eyebrow block">{item.organization}</span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {item.title}
                    </h3>
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {item.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 border border-border text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-base text-foreground/90 leading-relaxed">
                  {item.summary}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm text-muted leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-signal shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA for Resume & Publications */}
      <div className="pt-2">
        <TiltCard className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5" disableTilt>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-foreground">
              Need the full CV?
            </h3>
            <p className="text-sm text-muted">
              Download the curriculum vitae with education, credentials, and publications.
            </p>
          </div>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-lg btn-signal h-10 px-5 text-xs font-semibold uppercase tracking-wider shrink-0"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </Link>
        </TiltCard>
      </div>
    </div>
  )
}
