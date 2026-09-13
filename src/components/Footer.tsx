'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, ShieldCheck, Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react'
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
    <footer className="mt-20 border-t border-border bg-background/90 relative z-10">
      <div className="max-w-6xl mx-auto px-5 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-border/60">
          {/* Column 1: Identity & Telemetry */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="font-display text-xl font-bold text-foreground">
                {footer.name}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node"></span>
            </div>
            <p className="text-muted text-sm max-w-md leading-relaxed">
              {footer.description}
            </p>
            <p className="text-xs text-muted-dark leading-relaxed max-w-md">
              Focusing on software quality engineering, automated test suites, relational data integrity, and doctoral research in computer science.
            </p>

            {/* Live website visits counter panel */}
            {footer.show_website_visits && (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-panel border border-border text-xs font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse-node"></span>
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>
                  Live visits to this site: <strong className="text-primary font-mono">{visits.toLocaleString()}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div>
            <span className="eyebrow block mb-4">Navigation</span>
            <ul className="space-y-2 text-sm text-muted">
              {footer.links.map((link) => (
                <li key={link.target}>
                  <Link
                    href={link.target}
                    className="hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/resume"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Curriculum Vitae (PDF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <span className="eyebrow block mb-4">Connect</span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={owner.linkedin_url || '/linkedin'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted hover:text-primary transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-primary" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href={owner.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted hover:text-foreground transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-muted" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${owner.email}`}
                  className="flex items-center space-x-2 text-muted hover:text-energy transition-colors"
                >
                  <Mail className="w-4 h-4 text-energy" />
                  <span className="font-mono text-xs">{owner.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-dark gap-3">
          <div>{footer.copyright}</div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Verified Telemetry & Credentials
            </span>
            <span>·</span>
            <span className="font-mono text-[11px]">Fairfax, Virginia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
