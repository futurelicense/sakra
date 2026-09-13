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
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  Users,
  Cpu,
  Mail,
  Send,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { TemplatePreviewModal, TemplatePreviewData } from '@/components/TemplatePreviewModal'
import portfolioData from '@/data/portfolio.json'

export default function HomePage() {
  const { home, owner, free_templates, publications, experience } = portfolioData.portfolio
  const [liveVisits, setLiveVisits] = useState<number>(1420)
  const [activeStep, setActiveStep] = useState<number>(0)
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
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.website_visits) {
          setLiveVisits(data.data.website_visits)
        }
      })
      .catch(() => {})
  }, [])

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
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: 'template_download', id })
    }).catch(() => {})

    setDownloadSuccessToast(title)
    setTimeout(() => setDownloadSuccessToast(null), 4000)
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
    <div className="relative overflow-hidden space-y-28 md:space-y-36 pb-28">
      {/* Interactive Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onDownload={handleTemplateDownload}
      />

      {/* Floating Download Success Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-panel border border-signal text-foreground px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in backdrop-blur-xl">
          <CheckCircle2 className="w-5 h-5 text-signal" />
          <span className="text-sm">Downloaded: <strong className="text-primary">{downloadSuccessToast}</strong></span>
        </div>
      )}

      {/* Ambient Engineering Background (Atmospheric Orbs & 72px Tech Grid) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden h-[125vh] min-h-[850px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 tech-grid opacity-[0.38]" />

        {/* Atmospheric Drift Glow Orbs */}
        <div className="absolute left-[6%] top-[10%] h-72 w-72 animate-drift rounded-full bg-primary/20 blur-[110px]" />
        <div className="absolute right-[8%] top-[24%] h-80 w-80 animate-drift rounded-full bg-energy/15 blur-[120px] [animation-delay:-4s]" />
        <div className="absolute left-[36%] top-[2%] h-64 w-64 animate-drift rounded-full bg-signal/15 blur-[100px] [animation-delay:-7s]" />

        {/* Orbital SVG Radar / Compass Rings */}
        <svg
          viewBox="0 0 100 100"
          className="absolute right-[5%] top-[8%] h-48 w-48 animate-spin-slow text-primary/20 md:h-72 md:w-72"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="50" cy="50" r="46" strokeWidth="1.2" strokeDasharray="3 7" strokeLinecap="round" />
          <circle cx="50" cy="50" r="32" strokeWidth="0.8" strokeDasharray="2 6" strokeLinecap="round" />
        </svg>

        <svg
          viewBox="0 0 100 100"
          className="absolute right-[8%] top-[12%] h-36 w-36 animate-spin-slow-reverse text-energy/20 md:h-52 md:w-52"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="50" cy="50" r="46" strokeWidth="1.2" strokeDasharray="4 8" strokeLinecap="round" />
        </svg>

        {/* Floating crosshairs */}
        <svg
          viewBox="0 0 48 48"
          className="absolute left-[5%] top-[48%] h-8 w-8 animate-float-slow text-primary/35 md:h-10 md:w-10"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
        >
          <path d="M24 4v40M6 14l36 20M42 14 6 34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <svg
          viewBox="0 0 48 48"
          className="absolute right-[14%] top-[58%] h-7 w-7 animate-float-slow text-energy/35 [animation-delay:-2.5s] md:h-9 md:w-9"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
        >
          <path d="M24 4v40M6 14l36 20M42 14 6 34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Smooth bottom fade to background */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-5 pt-32 pb-12 md:px-8 md:pt-40">
        {/* Eyebrow badge with live pulsing node */}
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary backdrop-blur-sm animate-fade-in shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          Sakera Begum, MSIT · Doctor of Computer Science Candidate
        </span>

        {/* Primary bold claim */}
        <h1 className="mt-5 max-w-4xl font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] text-foreground tracking-tight">
          I help software and data systems <span className="font-accent italic font-normal text-gradient">work reliably</span> at scale.
        </h1>

        {/* Narrative descriptions */}
        <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted">
          I am an IT consultant, QA analyst, and data researcher. I work across software quality assurance, test automation, data cleansing, and technical environments. My job is to find defects, validate data accuracy, and verify systems before they reach users.
        </p>

        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted/80">
          I combine graduate training in Information Technology with doctoral research in Computer Science, bridging hands-on defect management with predictive machine learning models.
        </p>

        {/* Glowing Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center gap-3.5">
          <a
            href="#journey"
            className="inline-flex items-center justify-center gap-2 rounded-lg btn-signal h-11 px-6 text-sm font-semibold uppercase tracking-wider"
          >
            See how I got here
            <ArrowDown className="h-4 w-4" />
          </a>
          <Link
            href="/experience"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all h-11 px-6 text-sm font-semibold uppercase tracking-wider backdrop-blur-sm"
          >
            View my experience
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#resources"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white/[0.03] text-muted hover:text-foreground hover:bg-white/[0.06] transition-all h-11 px-5 text-sm font-medium"
          >
            <FileSpreadsheet className="h-4 w-4 text-signal" />
            Free templates
          </a>
        </div>

        {/* 4 Telemetry Metrics Cards with TiltCard 3D & Count-Up animation */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.metrics.map((metric) => {
            const displayVal = metric.dynamic ? liveVisits : metric.value
            return (
              <TiltCard key={metric.id} className="p-6">
                <div className="font-display text-4xl md:text-5xl font-bold text-primary tracking-tight">
                  <AnimatedCounter value={displayVal} />
                  <span className="text-signal text-3xl md:text-4xl">{metric.suffix}</span>
                </div>
                <p className="mt-2 text-sm leading-snug text-muted font-medium">
                  {metric.label}
                </p>
                {metric.dynamic && (
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-signal uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
                    Live verified counter
                  </span>
                )}
              </TiltCard>
            )
          })}
        </div>
      </section>

      {/* Step-by-Step Career Journey Section ("How I got here") */}
      <section id="journey" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-12 md:px-8">
        <header className="mb-10 max-w-3xl">
          <span className="eyebrow">My Career Arc</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            From organizational operations to doctoral computer science.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            My career began in workforce coordination, then expanded step-by-step into frontline IT support, enterprise data validation, software testing, and advanced machine learning research. Each step deepened my ability to find system risks and deliver dependable solutions.
          </p>
        </header>

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

      {/* Software & Tools Constellation with Live Tab Filtering */}
      <section className="mx-auto max-w-5xl scroll-mt-24 px-5 py-12 md:px-8 space-y-8">
        <header className="max-w-3xl">
          <span className="eyebrow">Tools & Systems</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Software I work with every day
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            From designing test matrices and executing regression suites to writing SQL queries and training defect forecasting models.
          </p>
        </header>

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
                  : 'bg-white/[0.04] text-muted hover:text-foreground border border-border'
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
                    className="group relative rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
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

      {/* Featured Projects / Track Record Section */}
      <section className="mx-auto max-w-5xl scroll-mt-24 px-5 py-12 md:px-8">
        <header className="mb-10 max-w-3xl">
          <span className="eyebrow">Track Record</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Proven outcomes, described in plain language
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            A few examples of high-impact work delivered across software testing, data analysis, and technical environments.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: UpSkill Consultancy */}
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

          {/* Card 2: TaskInspota */}
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

          {/* Card 3: Publications */}
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

          {/* Card 4: WUST Campus */}
          <TiltCard className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Terminal className="h-4 w-4" />
                </span>
                <span className="eyebrow">Campus Infrastructure</span>
              </span>
              <span className="font-mono text-xs text-muted">Vienna, VA · IT Systems</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-bold text-foreground leading-snug">
              Frontline Technical Administration & User Support
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
              Supported 100+ students and administrative staff, maintaining and configuring 75+ workstations, resolving 250+ service tickets, and enforcing institutional security access protocols.
            </p>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-primary">
              <span>100+ Users Supported</span>
              <span>250+ Requests Solved</span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Free Professional Templates Section (#resources) */}
      <section id="resources" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-12 md:px-8">
        <header className="mb-10 max-w-3xl">
          <span className="eyebrow">Free Downloads</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Free QA & analytics templates you can use today
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            Structured worksheets and checklists I use to design test matrices, track defects, and audit enterprise data. Preview the spreadsheet layout or download directly.
          </p>
        </header>

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

                <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-border/60">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-dark block mb-1">
                    Columns included ({tmpl.includes.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted">
                    {tmpl.includes.slice(0, 5).map((col) => (
                      <span key={col} className="bg-white/[0.04] px-2 py-0.5 rounded border border-border/40">
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-white/[0.08] transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    Preview
                  </button>
                  <a
                    href={tmpl.file_url}
                    download
                    onClick={() => handleTemplateDownload(tmpl.id, tmpl.file_url, tmpl.title)}
                    className="inline-flex items-center gap-1.5 rounded-lg btn-signal h-8 px-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </div>
                <span className="text-xs font-mono text-muted">
                  {tmpl.download_count} downloads
                </span>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Aggregate counter callout */}
        <div className="mt-8 rounded-xl panel p-4 text-center">
          <p className="text-sm font-mono text-muted">
            <span className="text-primary font-bold">
              <AnimatedCounter value={free_templates.aggregate_metrics.total_downloads} />+
            </span> professional templates downloaded by QA testers & data analysts so far
          </p>
        </div>
      </section>

      {/* Network Node & Interactive Contact Section */}
      <section className="mx-auto max-w-5xl scroll-mt-24 px-5 py-12 md:px-8">
        <header className="mb-10 max-w-3xl">
          <span className="eyebrow">Connect</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Let&#39;s start a conversation
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            Whether you have an open QA or analytics consulting role, need test-suite review, or want to collaborate on doctoral computer science research.
          </p>
        </header>

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
          <form onSubmit={handleContactSubmit} className="rounded-2xl panel p-6 md:p-8 hover:panel-glow">
            {formSubmitted && (
              <div className="mb-6 p-4 rounded-xl bg-signal/10 border border-signal/30 text-signal text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Thank you! Your message has been received. I will respond promptly.</span>
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
                  placeholder="Your Name"
                  className="h-10 w-full rounded-lg border border-border bg-white/[0.03] px-3.5 py-1 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
                  className="h-10 w-full rounded-lg border border-border bg-white/[0.03] px-3.5 py-1 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="organization">
                  Organization / Company
                </label>
                <input
                  id="organization"
                  type="text"
                  value={contactData.organization}
                  onChange={(e) => setContactData({ ...contactData, organization: e.target.value })}
                  placeholder="Company, University or Team"
                  className="h-10 w-full rounded-lg border border-border bg-white/[0.03] px-3.5 py-1 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted block" htmlFor="reason">
                  Topic / Inquiry *
                </label>
                <select
                  id="reason"
                  value={contactData.reason}
                  onChange={(e) => setContactData({ ...contactData, reason: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-[#141926] px-3.5 py-1 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
                  className="w-full rounded-lg border border-border bg-white/[0.03] p-3.5 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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

      {/* Closing Statement Panel */}
      <section className="mx-auto max-w-5xl px-5 pb-10 md:px-8">
        <TiltCard className="p-8 text-center md:p-12">
          <h2 className="mx-auto max-w-2xl font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Reliable technology isn&#39;t an accident. <span className="font-accent italic text-gradient font-normal">It is verified.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
            Quality software and trustworthy data come from asking the hard questions early, building structured test suites, and holding systems to rigorous standards.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/experience"
              className="inline-flex items-center justify-center gap-2 rounded-lg btn-signal h-10 px-6 text-xs font-semibold uppercase tracking-wider"
            >
              View My Experience
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/publications"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-all h-10 px-6 text-xs font-semibold uppercase tracking-wider"
            >
              Read My Publications
            </Link>
            <a
              href={owner.linkedin_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white/[0.03] text-muted hover:text-foreground hover:bg-white/[0.06] transition-all h-10 px-6 text-xs font-medium"
            >
              Connect on LinkedIn
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Site visits badge */}
          <div className="mx-auto mt-10 max-w-xs">
            <div className="rounded-xl border border-border bg-white/[0.02] px-6 py-4 text-center">
              <p className="font-display text-3xl font-bold text-primary font-mono">
                <AnimatedCounter value={liveVisits} />+
              </p>
              <p className="mt-1 text-xs text-muted uppercase tracking-wider font-mono">
                Visits to this portfolio so far
              </p>
            </div>
          </div>
        </TiltCard>
      </section>
    </div>
  )
}
