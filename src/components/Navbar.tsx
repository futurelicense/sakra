'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowUpRight, Download } from 'lucide-react'
import portfolioData from '@/data/portfolio.json'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { owner, navigation } = portfolioData.portfolio

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/90 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)]'
          : 'border-b border-transparent bg-background/55 backdrop-blur-md'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 md:px-8 transition-all duration-300 ${
          scrolled ? 'py-2.5' : 'py-3.5'
        }`}
      >
        <Link href="/" className="flex flex-col leading-tight group min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-[1.05rem] sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
              {owner.name}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal animate-pulse-node shrink-0" />
          </div>
          <span className="text-[11px] sm:text-xs text-muted font-medium truncate">
            IT Consultant · MSIT, DCS Candidate
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
          {owner.linkedin_url && (
            <a
              href={owner.linkedin_url}
              target="_blank"
              rel="noreferrer noopener"
              className="nav-link hidden lg:inline-flex items-center gap-1"
            >
              LinkedIn
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </a>
          )}
        </div>

        <div className="hidden sm:flex items-center">
          <Link
            href="/resume"
            className="inline-flex items-center gap-1.5 rounded-lg btn-signal px-3.5 py-2 text-xs font-semibold uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            Resume
          </Link>
        </div>

        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-muted hover:text-foreground hover:bg-slate-900/5"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/70 bg-white/95 backdrop-blur-xl px-5 pt-3 pb-5 space-y-1.5 animate-fade-in">
          {navigation.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-primary bg-teal-600/[0.08]'
                    : 'text-muted hover:text-foreground hover:bg-slate-900/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-3 border-t border-border/60">
            <Link
              href="/resume"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg btn-signal text-xs font-semibold uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              Download Resume
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
