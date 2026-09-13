'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowUpRight, ShieldCheck, Download } from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { owner, navigation } = portfolioData.portfolio

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex flex-col leading-tight group transition-transform duration-200"
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {owner.name}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse-node"></span>
          </div>
          <span className="text-xs text-muted font-medium">
            IT Consultant · MSIT, DCS Candidate
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navigation.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm'
                    : 'text-muted hover:text-foreground hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <a
            href={owner.linkedin_url || '/linkedin'}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:text-primary hover:bg-white/5 transition-colors hidden lg:inline-flex items-center gap-1"
          >
            LinkedIn
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/resume"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground hover:border-white/20 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            Resume
          </Link>
          <Link
            href="/experience"
            className="inline-flex items-center gap-1.5 rounded-lg btn-signal px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
          >
            Explore Work
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-5 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl">
          {navigation.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-muted hover:text-foreground hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
            <Link
              href="/resume"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-border bg-white/[0.03] text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Download Resume (PDF)
            </Link>
            <Link
              href="/experience"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg btn-signal text-xs font-semibold uppercase tracking-wider"
            >
              Explore Work
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
