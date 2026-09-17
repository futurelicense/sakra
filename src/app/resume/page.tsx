'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Mail,
  MapPin,
  CheckCircle2,
  Award,
  GraduationCap,
  Briefcase,
  Terminal,
  ShieldCheck,
  Layers,
  Sparkles,
  Copy,
  Check,
  Printer
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { LinkedinIcon } from '@/components/Icons'
import portfolioData from '@/data/portfolio'

export default function ResumePage() {
  const { owner, experience, publications, home } = portfolioData.portfolio
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleDownload = () => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'resume_download',
        path: '/resume',
        label: 'Curriculum Vitae (PDF)',
      }),
    }).catch(() => {})

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 4000)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(owner.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="relative overflow-hidden py-28 md:py-36 max-w-4xl mx-auto px-5 md:px-8 space-y-10">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20 -z-10" />

      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-panel border border-signal text-foreground px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in backdrop-blur-xl">
          <CheckCircle2 className="w-5 h-5 text-signal" />
          <span className="text-sm">Curriculum Vitae downloaded successfully!</span>
        </div>
      )}

      {/* Header and Download Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/70 pb-8">
        <div>
          <span className="eyebrow inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
            Curriculum Vitae & Credentials
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1 tracking-tight">
            {owner.name}
          </h1>
          <p className="text-sm sm:text-base text-muted font-mono mt-1">
            {owner.professional_title}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-slate-100 px-4 py-2.5 text-xs font-mono text-muted hover:text-foreground hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4 text-muted" />
            <span>Print</span>
          </button>

          {owner.resume_url ? (
            <a
              href={owner.resume_url}
              download
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg btn-signal h-10 px-5 text-xs font-semibold uppercase tracking-wider"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          ) : (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg btn-signal h-10 px-5 text-xs font-semibold uppercase tracking-wider"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          )}
        </div>
      </div>

      {/* Technical Resume Console Document */}
      <div className="rounded-3xl panel p-8 sm:p-12 shadow-2xl space-y-10 text-foreground print:bg-white print:text-black">
        {/* Contact Info Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6 text-xs sm:text-sm font-mono text-muted">
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4 text-energy" />
            <span>{owner.email}</span>
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-signal" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{owner.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <LinkedinIcon className="w-4 h-4 text-primary" />
            <a
              href={owner.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              linkedin.com/in/sakerabegum
            </a>
          </div>

          {owner.google_scholar_url && (
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              <a
                href={owner.google_scholar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Scholar
              </a>
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary border-b border-border/60 pb-1.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Executive Summary
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted">
            {home.about.content}
          </p>
        </section>

        {/* Education & Academic Credentials */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary border-b border-border/60 pb-1.5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Education & Doctoral Studies
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-border/40">
              <div>
                <strong className="text-foreground text-base font-display">Doctor of Computer Science (DCS)</strong>
                <div className="text-muted text-xs font-mono">University of the Potomac</div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 mt-2 sm:mt-0 w-fit">
                August 2026 – Present
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-border/40">
              <div>
                <strong className="text-foreground text-base font-display">Master of Science in Information Technology (MSIT)</strong>
                <div className="text-muted text-xs font-mono">Washington University of Science and Technology (WUST)</div>
              </div>
              <span className="text-xs font-mono text-muted mt-2 sm:mt-0">Graduated</span>
            </div>
          </div>
        </section>

        {/* Core Competencies & Skills */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary border-b border-border/60 pb-1.5 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            Technical Skills & Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-border/50">
              <strong className="text-foreground block mb-1 font-mono uppercase text-xs text-primary">Software QA & Testing:</strong>
              <span className="text-muted leading-relaxed">
                Manual Testing, Automated Testing, Regression Testing, Test Scenario & Matrix Design, Defect Tracking, UAT, JIRA, Selenium, Playwright
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-border/50">
              <strong className="text-foreground block mb-1 font-mono uppercase text-xs text-primary">Data & Analytics:</strong>
              <span className="text-muted leading-relaxed">
                SQL, Python, Advanced Microsoft Excel, Tableau, Data Cleansing, Schema Validation, Statistical Anomaly Detection
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-border/50">
              <strong className="text-foreground block mb-1 font-mono uppercase text-xs text-primary">IT Systems & Support:</strong>
              <span className="text-muted leading-relaxed">
                Hardware & Software Troubleshooting, Network Configuration, User Access Controls, Windows/Linux Environments
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-border/50">
              <strong className="text-foreground block mb-1 font-mono uppercase text-xs text-primary">Operations & Research:</strong>
              <span className="text-muted leading-relaxed">
                Cross-Functional Team Collaboration, Technical Documentation, Doctoral & Applied Research Writing
              </span>
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-6">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary border-b border-border/60 pb-1.5 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Work History
          </h2>
          <div className="space-y-6">
            {experience.roles.map((role) => (
              <div key={role.id} className="space-y-2 border-l-2 border-primary/40 pl-4 py-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-foreground text-base">
                      {role.role} - <span className="text-primary font-normal">{role.company}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-muted">
                    {role.start_date} – {role.end_date} {role.location && `(${role.location})`}
                  </span>
                </div>
                <p className="text-xs text-muted/80 italic font-mono">
                  {role.summary}
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-muted leading-relaxed">
                  {role.responsibilities.slice(0, 3).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Publications */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary border-b border-border/60 pb-1.5 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Selected Publications
          </h2>
          {publications.items.length > 0 ? (
            <div className="space-y-3 text-xs sm:text-sm">
              {publications.items.map((pub) => (
                <div key={pub.id} className="border-l-2 border-signal/50 pl-4 py-1">
                  <div className="font-display font-semibold text-foreground">{pub.title}</div>
                  <div className="text-muted text-xs font-mono">
                    {pub.authors.join(', ')}. {pub.journal_or_conference} ({pub.year})
                    {pub.doi ? ` · DOI: ${pub.doi}` : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted leading-relaxed">
              Conducting doctoral and applied research in machine learning, predictive analytics, and intelligent systems.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
