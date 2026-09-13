'use client'

import { useState } from 'react'
import {
  ExternalLink,
  MessageSquare,
  Share2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { LinkedinIcon } from '@/components/Icons'
import portfolioData from '@/data/portfolio.json'

export default function LinkedInPage() {
  const { linkedin, owner } = portfolioData.portfolio
  const [copied, setCopied] = useState(false)

  const handleLinkedInClick = () => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'linkedin_click'
      })
    }).catch(() => {})
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(owner.linkedin_url || 'https://www.linkedin.com/in/sakera-begum')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const articles = [
    {
      id: 'article-1',
      title: 'Building Resilient Regression Test Suites: Lessons From 15+ Release Cycles',
      category: 'Software Quality Assurance',
      readTime: '4 min read',
      date: 'Published 2026',
      summary:
        'Why flaky tests occur, how to isolate test environment state, and how prioritizing regression matrices by defect history dramatically shortens sprint validation windows.',
      metrics: '340+ Reactions · 42 Comments'
    },
    {
      id: 'article-2',
      title: 'Data Cleansing in the Enterprise: The Cost of Silent Schema Drifts',
      category: 'Data Analytics & Integrity',
      readTime: '6 min read',
      date: 'Published 2025',
      summary:
        'A breakdown of how minor schema shifts and null values corrupt downstream executive BI dashboards, and how heuristic SQL validation checks catch discrepancies early.',
      metrics: '280+ Reactions · 35 Comments'
    },
    {
      id: 'article-3',
      title: 'Bridging Industry QA With Doctoral Research in Machine Learning',
      category: 'Academic Journey & ML',
      readTime: '5 min read',
      date: 'Published 2026',
      summary:
        'Reflections on pursuing a Doctor of Computer Science while working in consulting: applying academic predictive defect algorithms to real-world agile engineering pipelines.',
      metrics: '410+ Reactions · 58 Comments'
    }
  ]

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-5xl mx-auto px-5 md:px-8 space-y-12">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          Professional Network & Articles
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {linkedin.page_title}
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {linkedin.description}
        </p>
      </div>

      {/* Hero LinkedIn Card */}
      <TiltCard className="p-8 sm:p-12 text-foreground relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none transform translate-x-8 -translate-y-8">
          <LinkedinIcon className="w-80 h-80 text-primary" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-border text-primary text-xs font-mono uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-signal" />
            Active Creator & Knowledge Sharer
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
            {linkedin.headline}
          </h2>

          <p className="text-muted text-sm sm:text-base leading-relaxed">
            I regularly share actionable insights on software testing methodologies, data cleansing workflows, defect prediction models, and doctoral research milestones.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={linkedin.cta.target || owner.linkedin_url || 'https://www.linkedin.com/in/sakera-begum'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkedInClick}
              className="inline-flex items-center gap-2 rounded-lg btn-signal h-11 px-6 text-sm font-semibold uppercase tracking-wider"
            >
              <LinkedinIcon className="w-4 h-4" />
              {linkedin.cta.label || 'Connect on LinkedIn'}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white/[0.04] px-4 py-2.5 text-xs font-mono text-muted hover:text-foreground hover:bg-white/[0.08] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-signal" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Profile Link'}</span>
            </button>
          </div>
        </div>
      </TiltCard>

      {/* Curated Thought Leadership Articles */}
      <div className="space-y-6">
        <div>
          <span className="eyebrow block">Featured Publications & Writing</span>
          <h2 className="font-display text-2xl font-bold text-foreground mt-1">
            Curated Articles & Discussions
          </h2>
          <p className="text-sm text-muted mt-1">
            Core subjects Sakera actively writes about, sharing lessons from consulting, software quality assurance, and doctoral studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((post) => (
            <TiltCard
              key={post.id}
              className="p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-muted mb-2">
                  <span className="text-primary">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted mt-2.5 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-dark">
                  {post.metrics}
                </span>

                <a
                  href={owner.linkedin_url || 'https://www.linkedin.com/in/sakera-begum'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkedInClick}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                >
                  <span>Read Post</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  )
}
