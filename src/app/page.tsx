'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Database,
  Terminal,
  BookOpen,
  ArrowRight,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { LinkedinIcon } from '@/components/Icons'
import portfolioData from '@/data/portfolio.json'

export default function HomePage() {
  const { home, owner, free_templates, publications } = portfolioData.portfolio
  const [liveVisits, setLiveVisits] = useState<number>(1420)

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.website_visits) {
          setLiveVisits(data.data.website_visits)
        }
      })
      .catch(() => {})
  }, [])

  const getExpertiseIcon = (title: string) => {
    switch (title) {
      case 'Software Quality Assurance':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />
      case 'Data Analytics':
        return <Database className="w-6 h-6 text-indigo-600" />
      case 'IT & Technical Support':
        return <Terminal className="w-6 h-6 text-emerald-600" />
      case 'Research & Knowledge Sharing':
        return <BookOpen className="w-6 h-6 text-purple-600" />
      default:
        return <Sparkles className="w-6 h-6 text-blue-600" />
    }
  }

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-white">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-xs sm:text-sm font-semibold text-blue-800 animate-fade-in shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              Doctor of Computer Science Researcher • QA & Analytics Specialist
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {home.hero.headline}
            </h1>

            {/* Sub-description */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {home.hero.description}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={home.hero.primary_cta.target}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all hover-lift"
              >
                {home.hero.primary_cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={home.hero.secondary_cta.target}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 shadow-sm transition-all hover-lift"
              >
                <Download className="w-4 h-4 text-gray-600" />
                {home.hero.secondary_cta.label}
              </Link>
              <Link
                href={home.hero.tertiary_cta.target}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all hover-lift"
              >
                <LinkedinIcon className="w-4 h-4 text-blue-600" />
                {home.hero.tertiary_cta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Metrics Counter Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {home.metrics.map((metric, idx) => {
              const displayVal = metric.dynamic ? liveVisits : metric.value
              return (
                <div
                  key={metric.id}
                  className={`flex flex-col items-center text-center ${idx > 0 ? 'pt-4 lg:pt-0' : ''}`}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 tracking-tight">
                    {displayVal.toLocaleString()}
                    <span className="text-blue-500 text-2xl sm:text-3xl lg:text-4xl">
                      {metric.suffix}
                    </span>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-medium text-gray-600">
                    {metric.label}
                  </div>
                  {metric.dynamic && (
                    <span className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real-time Counter
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-3xl text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <ShieldCheck className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              Profile Overview
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {home.about.title}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {home.about.content}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>Doctor of Computer Science (In Progress)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>M.S. in Information Technology</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span>Cross-functional Agile Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Core Expertise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Core Technical Expertise
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            A balanced foundation spanning software test engineering, enterprise analytics, IT architecture, and applied research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {home.expertise.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover-lift shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                {getExpertiseIcon(item.title)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Sections (Experience, Publications, Templates) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Experience Card */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-2xl p-8 flex flex-col justify-between hover-lift shadow-lg">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {home.featured_sections.experience.title}
              </h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                {home.featured_sections.experience.description}
              </p>
            </div>
            <div className="pt-8">
              <Link
                href={home.featured_sections.experience.cta.target}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg transition-colors w-full justify-center"
              >
                {home.featured_sections.experience.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Publications Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between hover-lift shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {home.featured_sections.publications.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {home.featured_sections.publications.description}
              </p>
              <div className="text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded inline-block">
                {publications.items.length} Peer-Reviewed & Working Papers
              </div>
            </div>
            <div className="pt-8">
              <Link
                href={home.featured_sections.publications.cta.target}
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-lg transition-colors w-full justify-center border border-purple-200"
              >
                {home.featured_sections.publications.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Free Templates Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between hover-lift shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {home.featured_sections.templates.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {home.featured_sections.templates.description}
              </p>
              <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block">
                {free_templates.templates.length} Free QA & Analytics Worksheets
              </div>
            </div>
            <div className="pt-8">
              <Link
                href={home.featured_sections.templates.cta.target}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-lg transition-colors w-full justify-center border border-emerald-200"
              >
                {home.featured_sections.templates.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Downloadable Templates Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Free Community Resources
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Popular QA & Analytics Templates
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Structured worksheets and checklists ready for download and implementation.
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {free_templates.templates.slice(0, 2).map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between hover-lift shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {tmpl.category}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {tmpl.format.join(' • ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {tmpl.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Includes {tmpl.includes.length} structured columns
                  </span>
                  <a
                    href={tmpl.file_url}
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Free
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
