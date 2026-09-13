'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Eye, ShieldCheck, Heart } from 'lucide-react'
import { LinkedinIcon, GithubIcon } from '@/components/Icons'
import portfolioData from '@/data/portfolio.json'

export function Footer() {
  const { footer, owner } = portfolioData.portfolio
  const [visits, setVisits] = useState<number>(1420)

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.website_visits) {
          setVisits(data.data.website_visits)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                SB
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{footer.name}</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              {footer.description}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
              Specialized in manual & automated software quality assurance, relational data validation, defect management, and business operations.
            </p>

            {/* Live website counter badge */}
            {footer.show_website_visits && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700/60 text-xs font-medium text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Site Visits: <strong className="text-white">{visits.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footer.links.map((link) => (
                <li key={link.target}>
                  <Link
                    href={link.target}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/resume"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Resume & CV
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={footer.social_links.linkedin || '/linkedin'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-blue-500" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href={footer.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-gray-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${owner.email}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{owner.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>{footer.copyright}</div>
          <div className="mt-3 sm:mt-0 flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Verified Portfolio & Metrics
            </span>
            <span>•</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
