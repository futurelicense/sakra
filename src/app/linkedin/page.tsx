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
  CheckCircle2
} from 'lucide-react'
import { LinkedinIcon } from '@/components/Icons'
import portfolioData from '@/data/portfolio.json'

export default function LinkedInPage() {
  const { linkedin, owner } = portfolioData.portfolio

  const handleLinkedInClick = () => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'linkedin_click'
      })
    }).catch(() => {})
  }

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-5xl mx-auto px-5 md:px-8 space-y-12">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="eyebrow inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          Professional Network & Insights
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {linkedin.page_title}
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {linkedin.description}
        </p>
      </div>

      {/* Hero LinkedIn Card */}
      <div className="rounded-3xl panel p-8 sm:p-12 text-foreground shadow-2xl relative overflow-hidden hover:panel-glow">
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
            Connect for industry collaboration, QA automation best practices, data validation frameworks, and doctoral research updates in computer science.
          </p>

          <div className="pt-2">
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
          </div>
        </div>
      </div>

      {/* Featured Insight Topics / Posts */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Featured Themes & Articles
          </h2>
          <p className="text-sm text-muted mt-1">
            Core subjects Sakera actively shares analyses, guides, and thought leadership on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {linkedin.featured_posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl panel p-6 flex flex-col justify-between hover:panel-glow transition-all space-y-4"
            >
              <div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/[0.04] text-primary border border-border">
                  {post.category}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground mt-3">
                  {post.title}
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <a
                  href={post.url || owner.linkedin_url || 'https://www.linkedin.com/in/sakera-begum'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkedInClick}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                >
                  <span>Read on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
