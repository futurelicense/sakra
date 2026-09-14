'use client'

import Link from 'next/link'
import { Eye, ShieldCheck, Mail } from 'lucide-react'
import { LinkedinIcon, GithubIcon } from '@/components/Icons'
import { useLiveMetrics } from '@/hooks/useLiveMetrics'
import portfolioData from '@/data/portfolio.json'

export function Footer() {
  const { footer, owner } = portfolioData.portfolio
  const { visits } = useLiveMetrics({ intervalMs: 15000 })

  return (
    <footer className="mt-16 border-t border-border bg-white relative z-10">
      <div className="max-w-6xl mx-auto px-5 py-12 md:px-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl font-bold text-foreground tracking-tight">
                {footer.name}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
            </div>
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              {footer.description}
            </p>
            {footer.show_website_visits && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white text-xs text-muted shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>
                  <strong className="text-primary font-mono tabular-nums">
                    {visits === null ? '—' : visits.toLocaleString()}
                  </strong>{' '}
                  visits
                </span>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <span className="eyebrow block mb-3.5">Navigate</span>
            <ul className="space-y-2 text-sm text-muted">
              {footer.links.map((link) => (
                <li key={link.target}>
                  <Link href={link.target} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/resume" className="hover:text-primary transition-colors">
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <span className="eyebrow block mb-3.5">Connect</span>
            <ul className="space-y-2.5 text-sm">
              {owner.linkedin_url && (
                <li>
                  <a
                    href={owner.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4 text-primary" />
                    LinkedIn
                  </a>
                </li>
              )}
              {owner.github_url && (
                <li>
                  <a
                    href={owner.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${owner.email}`}
                  className="flex items-center gap-2 text-muted hover:text-energy transition-colors"
                >
                  <Mail className="w-4 h-4 text-energy" />
                  <span className="font-mono text-xs">{owner.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-fade mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-dark gap-3">
          <div>{footer.copyright}</div>
          <div className="flex items-center gap-2 text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Verified credentials</span>
            <span className="text-border">·</span>
            <span className="font-mono text-[11px]">Fairfax, VA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
