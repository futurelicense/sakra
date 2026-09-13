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
    <div className="py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
          Professional Network
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          {linkedin.page_title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {linkedin.description}
        </p>
      </div>

      {/* Hero LinkedIn Card */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <LinkedinIcon className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Active Creator & Knowledge Sharer
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            {linkedin.headline}
          </h2>

          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Connect for industry collaboration, QA automation best practices, data validation frameworks, and doctoral research updates in computer science.
          </p>

          <div className="pt-2">
            <a
              href={linkedin.cta.target || owner.linkedin_url || 'https://www.linkedin.com/in/sakera-begum'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkedInClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-blue-900 bg-white hover:bg-blue-50 shadow-lg shadow-black/10 transition-all hover-lift"
            >
              <LinkedinIcon className="w-5 h-5 text-blue-700" />
              {linkedin.cta.label || 'Connect on LinkedIn'}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Featured Insight Topics / Posts */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Themes & Articles
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Core subjectsSakera actively shares analyses, guides, and thought leadership on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {linkedin.featured_posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover-lift shadow-sm hover:border-blue-300 transition-all space-y-4"
            >
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <a
                  href={post.url || owner.linkedin_url || 'https://www.linkedin.com/in/sakera-begum'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkedInClick}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
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
