'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Database,
  Terminal,
  BookOpen,
  ArrowRight,
  ArrowDown,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Users,
  Cpu,
  Send,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { SectionHeader } from '@/components/SectionHeader'
import { TemplatePreviewModal, TemplatePreviewData } from '@/components/TemplatePreviewModal'
import { useLiveMetrics } from '@/hooks/useLiveMetrics'
import { isResourceTemplateId } from '@/lib/templateIds'
import { registerDownload, triggerFileDownload } from '@/lib/stats'
import portfolioData from '@/data/portfolio.json'

export default function HomePage() {
  const { home, owner, free_templates, publications, experience } = portfolioData.portfolio
  const { visits, templateDownloads, refresh } = useLiveMetrics()
  const [localTemplateCounters, setLocalTemplateCounters] = useState<Record<string, number> | null>(null)
  const [activeToolCategory, setActiveToolCategory] = useState<string>('All')
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreviewData | null>(null)
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null)
  const [emailCopied, setEmailCopied] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    organization: '',
    reason: 'Software Quality Assurance',
    message: ''
  })

  useEffect(() => {
    if (templateDownloads) setLocalTemplateCounters(templateDownloads)
  }, [templateDownloads])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 5000)
    setContactData({
      name: '',
      email: '',
      organization: '',
      reason: 'Software Quality Assurance',
      message: ''
    })
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(owner.email)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2500)
  }

  const handleTemplateDownload = (id: string, fileUrl: string, title: string) => {
    triggerFileDownload(fileUrl)

    setLocalTemplateCounters((prev) => {
      const base = prev ?? {}
      const current =
        typeof base[id] === 'number'
          ? base[id]
          : free_templates.templates.find((t) => t.id === id)?.download_count ?? 0
      return { ...base, [id]: current + 1 }
    })

    if (isResourceTemplateId(id)) {
      registerDownload(id)
        .then((next) => {
          if (next > 0) {
            setLocalTemplateCounters((prev) => ({ ...(prev ?? {}), [id]: next }))
          }
        })
        .catch(() => refresh())
    }

    setDownloadSuccessToast(title)
    setTimeout(() => setDownloadSuccessToast(null), 4000)
  }

  const templateCounters = localTemplateCounters
  const liveTemplateTotal = free_templates.templates.reduce((acc, tmpl) => {
    const live = templateCounters?.[tmpl.id]
    return acc + (typeof live === 'number' ? live : tmpl.download_count)
  }, 0)

  const metricValue = (metric: (typeof home.metrics)[number]) => {
    if (metric.id === 'website_visits' || metric.dynamic) {
      return visits
    }
    return metric.value
  }

  // 5-Step Career Arc modeled after the plain-language storytelling on adeolaaliu.com
  const journeySteps = [
    {
      step: '1',
      title: 'Human Factors & Organizational Operations',
      subtitle: 'British IELTS Mock Test Center · HR Manager',
      icon: <Users className="h-5 w-5" />,
      description:
        'I managed operations, recruitment, and employee support for 25+ team members. My first foundational skill was understanding how people interact with systems, clear communication, and process accountability.'
    },
    {
      step: '2',
      title: 'Frontline IT Systems & User Environments',
      subtitle: 'Washington University of Science & Technology · IT Assistant',
      icon: <Terminal className="h-5 w-5" />,
      description:
        'At the university, I stepped deep into hands-on technology: supporting 100+ students and faculty, resolving 250+ technical requests, and configuring 75+ workstations, security access, and campus network nodes.'
    },
    {
      step: '3',
      title: 'Enterprise Data Quality & Analytics',
      subtitle: 'TaskInspota Inc. · Data Analyst',
      icon: <Database className="h-5 w-5" />,
      description:
        'I validated, cleansed, and analyzed 30,000+ records across 20+ datasets. Using SQL, Python, and Excel, I learned how messy raw data creates silent system failures, and how rigorous validation protects critical business decisions.'
    },
    {
      step: '4',
      title: 'Software Quality Assurance & Test Engineering',
      subtitle: 'UpSkill Consultancy · IT Consultant & QA Analyst',
      icon: <ShieldCheck className="h-5 w-5" />,
      description:
        'I took charge of software reliability: designing and executing 150+ manual and automated test cases, tracking 60+ bugs to resolution in Jira, and ensuring smooth delivery across 15+ release sprint cycles.'
    },
    {
      step: '5',
      title: 'Doctoral Research & Intelligent Software Reliability',
      subtitle: 'Doctor of Computer Science (DCS) · WUST',
      icon: <Cpu className="h-5 w-5" />,
      description:
        'Today, I conduct doctoral research combining machine learning with agile CI/CD pipelines to forecast regression defects before deployment, publishing peer-reviewed research in software engineering.'
    }
  ]

  // Software & Tools constellation with categories
  const toolsConstellation = [
    {
      category: 'Software Quality & Testing',
      tools: ['Manual Testing', 'Automated Testing', 'Regression Testing', 'Jira', 'Selenium', 'Playwright', 'Test Case Design', 'Defect Tracking', 'User Acceptance Testing (UAT)']
    },
    {
      category: 'Data Analytics & Validation',
      tools: ['SQL', 'Python (Pandas)', 'Microsoft Excel', 'Tableau', 'Data Cleansing', 'Anomaly Detection', 'Schema Validation', 'Power BI']
    },
    {
      category: 'IT Systems & Architecture',
      tools: ['Linux Environments', 'Windows Server', 'Git & GitHub', 'System Configuration', 'User Access Controls', 'Technical Documentation']
    },
    {
      category: 'Research & Intelligent Systems',
      tools: ['Doctoral Research', 'Predictive Defect Models', 'CI/CD Pipelines', 'Technical Writing', 'Peer-Reviewed Publishing', 'Agile / Scrum']
    }
  ]

  const toolCategories = ['All', ...toolsConstellation.map((t) => t.category)]

  const filteredToolGroups =
    activeToolCategory === 'All'
      ? toolsConstellation
      : toolsConstellation.filter((t) => t.category === activeToolCategory)

  return (
    <div className="relative overflow-hidden space-y-24 md:space-y-32 pb-24">
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onDownload={handleTemplateDownload}
      />

      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-signal/40 bg-panel/95 px-5 py-3 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-signal shrink-0" />
          <span className="text-sm text-foreground">
            Downloaded: <strong className="text-primary">{downloadSuccessToast}</strong>
          </span>
        </div>
      )}

      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden h-[110vh] min-h-[720px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 tech-grid opacity-[0.45]" />
        <div className="absolute left-[8%] top-[12%] h-64 w-64 md:h-80 md:w-80 animate-drift rounded-full bg-teal-400/25 blur-[100px]" />
        <div className="absolute right-[10%] top-[22%] h-72 w-72 md:h-96 md:w-96 animate-drift rounded-full bg-emerald-300/20 blur-[110px] [animation-delay:-5s]" />
        <div className="absolute left-[40%] top-[6%] h-56 w-56 animate-drift rounded-full bg-orange-300/15 blur-[90px] [animation-delay:-8s]" />

        <svg
          viewBox="0 0 100 100"
          className="absolute right-[6%] top-[10%] h-40 w-40 animate-spin-slow text-teal-700/15 md:h-56 md:w-56"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="50" cy="50" r="46" strokeWidth="1.1" strokeDasharray="3 7" strokeLinecap="round" />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="absolute right-[9%] top-[14%] h-28 w-28 animate-spin-slow-reverse text-orange-700/12 md:h-40 md:w-40"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="50" cy="50" r="46" strokeWidth="1.1" strokeDasharray="4 8" strokeLinecap="round" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-b from-transparent via-background/80 to-background" />
      </div>

      {/* Hero */}
      <section className="relative section-shell pt-28 pb-8 md:pt-36">
        <span className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3.5 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-[0.09em] text-primary shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          MSIT · Doctor of Computer Science Candidate
        </span>

        <h1 className="reveal reveal-delay-1 mt-5 max-w-4xl font-display text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.1rem] font-bold leading-[1.05] text-foreground tracking-tight">
          I help software and data systems{' '}
          <span className="font-accent italic font-normal text-gradient">work reliably</span>{' '}
          at scale.
        </h1>

        <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-lg md:text-xl leading-relaxed text-muted">
          QA analyst, data researcher, and IT consultant focused on finding defects early, validating data integrity, and verifying systems before they reach users.
        </p>

        <p className="reveal reveal-delay-3 mt-3 max-w-2xl text-base leading-relaxed text-muted/75">
          Bridging hands-on quality engineering with doctoral research in predictive machine learning for software reliability.
        </p>

        <div className="reveal reveal-delay-4 mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#journey"
            className="inline-flex items-center justify-center gap-2 rounded-lg btn-signal h-11 px-5 text-sm font-semibold uppercase tracking-wider"
          >
            See how I got here
            <ArrowDown className="h-4 w-4" />
          </a>
          <Link
            href="/experience"
            className="inline-flex items-center justify-center gap-2 rounded-lg btn-ghost h-11 px-5 text-sm font-semibold uppercase tracking-wider"
          >
            View experience
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#resources"
            className="inline-flex items-center justify-center gap-2 rounded-lg btn-quiet h-11 px-4 text-sm font-medium"
          >
            <FileSpreadsheet className="h-4 w-4 text-signal" />
            Free templates
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {home.metrics.map((metric, idx) => {
            const displayVal = metricValue(metric)
            const isLive = metric.id === 'website_visits' || Boolean(metric.dynamic)
            return (
              <TiltCard
                key={metric.id}
                className={`p-5 md:p-6 reveal reveal-delay-${Math.min(idx + 1, 4)}`}
              >
                <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight tabular-nums">
                  {typeof displayVal === 'number' ? (
                    <>
                      <AnimatedCounter value={displayVal} />
                      <span className="text-signal text-2xl md:text-3xl lg:text-4xl">{metric.suffix}</span>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </div>
                <p className="mt-2 text-xs md:text-sm leading-snug text-muted font-medium">
                  {metric.label}
                </p>
                {isLive && (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono text-signal uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
                    Live
                  </span>
                )}
              </TiltCard>
            )
          })}
        </div>
      </section>

      <div className="section-shell">
        <div className="divider-fade" />
      </div>

      {/* Career journey */}
      <section id="journey" className="section-shell">
        <SectionHeader
          eyebrow="Career Arc"
          title="From organizational operations to doctoral computer science."
          description="Each step deepened the ability to spot system risk early - from people and process, through IT support and data quality, into software QA and predictive research."
        />

        {/* Connected Journey List with Interactive Tilt */}
        <ol className="space-y-6 relative">
          {journeySteps.map((step, idx) => (
            <li key={step.step} className="relative">
              <TiltCard className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform duration-300 group-hover:scale-110">
                    {step.icon}
                  </span>
                  <span className="font-display text-xl font-bold text-primary font-mono">
                    Step {step.step}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-3 text-xs sm:text-sm font-mono text-energy uppercase tracking-wider">
                  {step.subtitle}
                </p>

                <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
                  {step.description}
                </p>
              </TiltCard>

              {/* Connecting vertical line between cards */}
              {idx < journeySteps.length - 1 && (
                <span
                  className="absolute -bottom-6 left-10 hidden h-6 w-px bg-gradient-to-b from-primary/50 to-transparent md:block z-20"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Tools constellation */}
      <section className="section-shell space-y-7">
        <SectionHeader
          eyebrow="Tools & Systems"
          title="Software I work with every day"
          description="From designing test matrices and executing regression suites to writing SQL queries and training defect forecasting models."
        />

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <SlidersHorizontal className="h-4 w-4 text-primary shrink-0 ml-1" />
          {toolCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveToolCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all shrink-0 ${
                activeToolCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'btn-quiet'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredToolGroups.map((group) => (
            <TiltCard key={group.category} className="p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.tools.map((tool) => (
                  <li
                    key={tool}
                    className="group relative rounded-full border border-border bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:bg-teal-50"
                  >
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-signal align-middle transition-colors duration-200" />
                    {tool}
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Track record */}
      <section className="section-shell">
        <SectionHeader
          eyebrow="Track Record"
          title="Proven outcomes, described in plain language"
          description="A few examples of high-impact work across software testing, data analysis, and technical environments."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card: We Sustain Growth / NSCR */}
          <TiltCard className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <span className="eyebrow">We Sustain Growth</span>
              </span>
              <span className="font-mono text-xs text-muted">Remote · NSCR Platform</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-foreground leading-snug">
              AI Capital Readiness Score Validation
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
              Validated assessment flows, scoring logic, and founder-facing recommendations for NSCR - an AI-powered platform that evaluates startup funding readiness across investor criteria.
            </p>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-primary">
              <span>5 Readiness Dimensions</span>
              <a
                href="https://wesustaingrowth.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
              >
                wesustaingrowth.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </TiltCard>

          {/* Card: UpSkill Consultancy */}
          <TiltCard className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="eyebrow">UpSkill Consultancy</span>
              </span>
              <span className="font-mono text-xs text-muted">Remote · QA & Testing</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-foreground leading-snug">
              150+ Test Cases & Agile Release Validation
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
              Designed and executed comprehensive manual and automated test suites covering functional, regression, and user acceptance criteria across 15+ release sprint cycles, catching 60+ critical defects before deployment.
            </p>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-primary">
              <span>150+ Tests Executed</span>
              <span>60+ Bugs Resolved</span>
            </div>
          </TiltCard>

          {/* Card: TaskInspota */}
          <TiltCard className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Database className="h-4 w-4" />
                </span>
                <span className="eyebrow">TaskInspota Inc.</span>
              </span>
              <span className="font-mono text-xs text-muted">Remote · Analytics</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-foreground leading-snug">
              30,000+ Record Cleansing & SQL Anomaly Validation
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
              Built automated SQL checks and Python cleaning pipelines across 20+ heterogeneous datasets, assessing missing values, referential integrity, and delivering 25+ business intelligence reports.
            </p>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-primary">
              <span>30k+ Records Audited</span>
              <span>25+ Executive Reports</span>
            </div>
          </TiltCard>

          {/* Card: Publications */}
          <TiltCard className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="eyebrow">Scholarly Research</span>
              </span>
              <span className="font-mono text-xs text-muted">IJSEQA & IEEE</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-foreground leading-snug">
              Machine Learning Defect Prediction in Agile QA
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
              Peer-reviewed research investigating predictive commit classification and code complexity metrics inside CI/CD pipelines to forecast regression defects with an 18% improvement in early defect discovery.
            </p>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-primary">
              <span>Peer-Reviewed Journal</span>
              <Link href="/publications" className="hover:underline flex items-center gap-1">
                View Publications
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Free templates */}
      <section id="resources" className="section-shell">
        <SectionHeader
          eyebrow="Free Downloads"
          title="QA & analytics templates you can use today"
          description="Structured worksheets for test matrices, defect tracking, and data audits. Preview the layout or download directly."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {free_templates.templates.map((tmpl) => (
            <TiltCard key={tmpl.id} className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">
                    {tmpl.format.join(' · ')}
                  </span>
                  <span className="text-xs font-mono text-muted">
                    {tmpl.category}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mt-1">
                  {tmpl.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
                  {tmpl.description}
                </p>

                <div className="mt-4 p-3 rounded-lg surface-soft">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-dark block mb-1">
                    Columns included ({tmpl.includes.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted">
                    {tmpl.includes.slice(0, 5).map((col) => (
                      <span key={col} className="bg-white px-2 py-0.5 rounded border border-border">
                        {col}
                      </span>
                    ))}
                    {tmpl.includes.length > 5 && (
                      <span className="text-primary font-mono">+{tmpl.includes.length - 5} more</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tmpl as TemplatePreviewData)}
                    className="inline-flex items-center gap-1.5 rounded-lg btn-quiet px-3 py-1.5 text-xs font-semibold"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateDownload(tmpl.id, tmpl.file_url, tmpl.title)}
                    className="inline-flex items-center gap-1.5 rounded-lg btn-signal h-8 px-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
                <span className="text-xs font-mono text-muted">
                  {(
                    templateCounters?.[tmpl.id] ?? tmpl.download_count
                  ).toLocaleString()}{' '}
                  downloads
                </span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Aggregate counter callout */}
        <div className="mt-8 rounded-xl panel p-4 text-center">
          <p className="text-sm font-mono text-muted">
            <span className="text-primary font-bold">
              {typeof liveTemplateTotal === 'number' ? (
                <AnimatedCounter value={liveTemplateTotal} />
              ) : (
                '—'
              )}
              +
            </span> professional templates downloaded by QA testers & data analysts so far
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="section-shell">
        <SectionHeader
          eyebrow="Connect"
          title="Let's start a conversation"
          description="Open to QA consulting, analytics reviews, or doctoral research collaboration."
        />

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr]">
          {/* Left: Telemetry Node Panel */}
          <TiltCard className="p-6 md:p-8">
            <span className="eyebrow">Active Collaboration Nodes</span>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              I am actively engaged in consulting, contract QA execution, enterprise data audits, and scientific academic collaborations.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                'Software Quality Assurance & UAT',
                'Automated Regression Test Suites',
                'Enterprise SQL Data Cleansing',
                'Defect Prediction Machine Learning',
                'Doctoral Research & Publications',
                'Agile Sprint Release Validation',
                'Technical Problem Solving & Support'
              ].map((node) => (
                <li key={node} className="flex items-center gap-3">
                  <span className="h-5 w-5 shrink-0 rounded-full border border-primary/50 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
                  </span>
                  <span className="font-mono text-xs text-muted hover:text-foreground transition-colors">
                    {node}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <span>Fairfax, VA / Remote</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                {emailCopied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{emailCopied ? 'Email Copied' : owner.email}</span>
              </button>
            </div>
          </TiltCard>

          {/* Right: Contact Form */}
          <form onSubmit={handleContactSubmit} className="rounded-2xl panel p-6 md:p-8">
            {formSubmitted && (
              <div className="mb-6 p-4 rounded-xl bg-signal/10 border border-signal/30 text-signal text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Thank you - your message has been received.</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="name">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  placeholder="Your name"
                  className="field h-10 px-3.5 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="you@domain.com"
                  className="field h-10 px-3.5 text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="organization">
                  Organization
                </label>
                <input
                  id="organization"
                  type="text"
                  value={contactData.organization}
                  onChange={(e) => setContactData({ ...contactData, organization: e.target.value })}
                  placeholder="Company, university, or team"
                  className="field h-10 px-3.5 text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="reason">
                  Topic *
                </label>
                <select
                  id="reason"
                  value={contactData.reason}
                  onChange={(e) => setContactData({ ...contactData, reason: e.target.value })}
                  className="field h-10 px-3.5 text-sm bg-white"
                >
                  <option value="Software Quality Assurance">Software Quality Assurance / Testing</option>
                  <option value="Data Analytics & Cleansing">Data Analytics & Cleansing</option>
                  <option value="Doctoral Research Collaboration">Doctoral Research Collaboration</option>
                  <option value="Consulting / IT Support">Consulting / IT Support</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, or research topic..."
                  className="field p-3.5 text-sm min-h-[110px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg btn-signal h-11 px-6 text-sm font-semibold uppercase tracking-wider w-full sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Closing */}
      <section className="section-shell pb-6">
        <TiltCard className="p-8 text-center md:p-12" disableTilt>
          <h2 className="mx-auto max-w-2xl font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Reliable technology isn&#39;t an accident.{' '}
            <span className="font-accent italic text-gradient font-normal">It is verified.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            Quality software and trustworthy data come from structured testing, early risk detection, and rigorous validation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/experience"
              className="inline-flex items-center justify-center gap-2 rounded-lg btn-signal h-10 px-5 text-xs font-semibold uppercase tracking-wider"
            >
              View Experience
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/publications"
              className="inline-flex items-center justify-center gap-2 rounded-lg btn-ghost h-10 px-5 text-xs font-semibold uppercase tracking-wider"
            >
              Publications
            </Link>
            {owner.linkedin_url && (
              <a
                href={owner.linkedin_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-lg btn-quiet h-10 px-5 text-xs font-medium"
              >
                LinkedIn
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="mx-auto mt-10 max-w-[11rem]">
            <div className="rounded-xl border border-border bg-white px-5 py-4 text-center shadow-sm">
              <p className="font-display text-3xl font-bold text-primary tabular-nums">
                {typeof visits === 'number' ? <AnimatedCounter value={visits} /> : '—'}+
              </p>
              <p className="mt-1 text-[10px] text-muted uppercase tracking-wider font-mono">
                Portfolio visits
              </p>
            </div>
          </div>
        </TiltCard>
      </section>
    </div>
  )
}
