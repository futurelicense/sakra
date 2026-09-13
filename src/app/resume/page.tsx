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
  Layers
} from 'lucide-react'
import { LinkedinIcon } from '@/components/Icons'
import portfolioData from '@/data/portfolio.json'

export default function ResumePage() {
  const { owner, experience, publications, home } = portfolioData.portfolio
  const [downloadCount, setDownloadCount] = useState<number>(135)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = () => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: 'resume_download' })
    }).catch(() => {})

    setDownloadCount(prev => prev + 1)
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 4000)
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Resume downloaded successfully!</span>
        </div>
      )}

      {/* Header and Download Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Curriculum Vitae & Resume
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
            {owner.name}
          </h1>
          <p className="text-base text-gray-600 mt-1">
            {owner.professional_title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={owner.resume_url}
            download
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover-lift"
          >
            <Download className="w-4 h-4" />
            Download Resume (PDF)
          </a>
        </div>
      </div>

      {/* Clean Interactive Resume Document Preview */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-gray-800">
        {/* Contact Info Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{owner.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{owner.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkedinIcon className="w-4 h-4 text-blue-600" />
            <a
              href={owner.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              linkedin.com/in/sakera-begum
            </a>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Executive Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {home.about.content}
          </p>
        </section>

        {/* Education & Academic Credentials */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Education & Doctoral Studies
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <strong className="text-gray-900 text-base">Doctor of Computer Science (DCS)</strong>
                <div className="text-gray-600">Washington University of Science and Technology (WUST)</div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 mt-1 sm:mt-0 w-fit">
                In Progress (Expected 2026/2027)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2">
              <div>
                <strong className="text-gray-900 text-base">Master of Science in Information Technology (MSIT)</strong>
                <div className="text-gray-600">Washington University of Science and Technology (WUST)</div>
              </div>
              <span className="text-xs text-gray-500 mt-1 sm:mt-0">Graduated</span>
            </div>
          </div>
        </section>

        {/* Core Competencies & Skills */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            Technical Skills & Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <strong className="text-gray-900 block mb-1">Software QA & Testing:</strong>
              <span className="text-gray-600">
                Manual Testing, Automated Testing, Regression Testing, Test Scenario & Matrix Design, Defect Tracking, UAT, JIRA, Bugzilla
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <strong className="text-gray-900 block mb-1">Data & Analytics:</strong>
              <span className="text-gray-600">
                SQL, Python, Advanced Microsoft Excel, Tableau, Data Cleansing, Schema Validation, Statistical Anomaly Detection
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <strong className="text-gray-900 block mb-1">IT Systems & Support:</strong>
              <span className="text-gray-600">
                Hardware & Software Troubleshooting, Network Configuration, User Access Controls, Windows/Linux Environments
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <strong className="text-gray-900 block mb-1">Operations & Research:</strong>
              <span className="text-gray-600">
                Cross-Functional Team Collaboration, Technical Documentation, Scientific Peer-Reviewed Research Writing
              </span>
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Work History
          </h2>
          <div className="space-y-6">
            {experience.roles.map((role) => (
              <div key={role.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-950 text-base">
                      {role.role} — <span className="text-blue-700">{role.company}</span>
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {role.start_date} – {role.end_date} {role.location && `(${role.location})`}
                  </span>
                </div>
                <p className="text-xs text-gray-600 italic">
                  {role.summary}
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
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
          <h2 className="text-lg font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Selected Publications & Papers
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            {publications.items.map((pub) => (
              <div key={pub.id} className="border-l-2 border-blue-400 pl-3">
                <div className="font-semibold text-gray-900">{pub.title}</div>
                <div className="text-gray-500">
                  {pub.journal_or_conference} ({pub.year}) • {pub.publication_type}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
