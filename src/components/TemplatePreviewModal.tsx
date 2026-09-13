'use client'

import React, { useEffect } from 'react'
import { X, Download, FileSpreadsheet, CheckCircle2, ShieldCheck, Layers } from 'lucide-react'

export interface TemplatePreviewData {
  id: string
  title: string
  description: string
  category: string
  format: string[]
  file_url: string
  includes: string[]
  download_count: number
}

// Pre-configured realistic spreadsheet preview rows
const sampleRows: Record<string, { headers: string[]; rows: string[][] }> = {
  'qa-test-case-template': {
    headers: [
      'Test ID',
      'Requirement',
      'Test Scenario',
      'Expected Result',
      'Actual Result',
      'Status',
      'Priority',
      'Defect Ref'
    ],
    rows: [
      ['TC-001', 'REQ-AUTH-01', 'Verify login with valid credentials', 'Redirect to /dashboard with session token', 'As expected. Redirected to /dashboard', 'Passed', 'High', 'None'],
      ['TC-002', 'REQ-AUTH-02', 'Verify login with incorrect password', 'Display inline error "Invalid credentials"', 'As expected. Inline red error shown', 'Passed', 'High', 'None'],
      ['TC-003', 'REQ-DATA-04', 'Verify CSV export for 10,000+ records', 'Export completed within 3.0s limit', 'Completed in 1.8s. All rows intact', 'Passed', 'Medium', 'None'],
      ['TC-004', 'REQ-SYNC-09', 'Verify webhook retry after network timeout', 'Exponential backoff trigger 3x', 'Retried 3 times then logged to DeadLetter', 'Passed', 'Critical', 'None'],
      ['TC-005', 'REQ-REG-12', 'Regression: User profile avatar upload (PNG/JPG)', 'Avatar thumbnail updated immediately', 'Upload succeeds, image compressed to 120kb', 'Passed', 'Medium', 'None']
    ]
  },
  'bug-tracking-template': {
    headers: [
      'Bug ID',
      'Severity',
      'Priority',
      'Environment',
      'Steps to Reproduce',
      'Assigned Dev',
      'Status',
      'Resolution'
    ],
    rows: [
      ['BUG-101', 'Critical', 'High', 'Staging (Chrome 122)', 'Rapidly double-click submit button on checkout', 'John D. (Backend)', 'Resolved', 'Added idempotency key & debounce'],
      ['BUG-102', 'Major', 'Medium', 'Production (Safari / iOS)', 'Open profile dropdown on mobile view', 'Sarah K. (Frontend)', 'In Progress', 'Refactoring z-index stacking context'],
      ['BUG-103', 'Minor', 'Low', 'All Environments', 'Hover over tooltip in telemetry card misaligned', 'Alex R. (UI/UX)', 'Closed', 'Adjusted CSS flex layout padding'],
      ['BUG-104', 'Major', 'High', 'Production (PostgreSQL)', 'Unique constraint race condition on user invitation', 'Elena M. (DBA)', 'Resolved', 'Added row-level lock & retry transaction']
    ]
  },
  'data-quality-checklist': {
    headers: [
      'Category',
      'Validation Check',
      'Verification Method',
      'Threshold',
      'Observed Result',
      'Status',
      'Remediation'
    ],
    rows: [
      ['Completeness', 'Null / Missing Primary Keys', 'SQL: count(*) where id is null', '0% missing keys', '0 missing keys found', 'PASS', 'None required'],
      ['Accuracy', 'Value Range Validation (Age, Salary)', 'Statistical descriptive min/max query', 'Age between 18-99, Salary > 0', '2 outliers found with negative values', 'REMEDIATED', 'Imputed using median and flagged ETL'],
      ['Consistency', 'Foreign Key Referential Integrity', 'Left join check on dimension tables', '100% matched keys', '100% referential integrity', 'PASS', 'None required'],
      ['Duplicates', 'De-duplication on Email / Phone', 'Group by email having count(*) > 1', 'Zero duplicate records allowed', '14 duplicate accounts identified', 'REMEDIATED', 'Merged duplicate UUIDs via script'],
      ['Schema', 'Data Type & Column Conformance', 'Automated JSON schema validator', '100% strict schema match', 'All 24 table schemas validated', 'PASS', 'Passed pre-deployment audit']
    ]
  },
  'data-analysis-project-tracker': {
    headers: [
      'Phase',
      'Objective',
      'Dataset Inventory',
      'Quality Checks',
      'Analysis Tasks',
      'Key Metric',
      'Insights Discovered'
    ],
    rows: [
      ['Phase 1: Ingestion', 'Aggregate customer transaction history', 'Sales_Q1_2026.csv, CRM_Export.sql', 'Schema validation, null checks', 'Load into PostgreSQL data warehouse', 'Records: 30,000+', 'Identified 5 disparate date formats'],
      ['Phase 2: Exploratory', 'Evaluate defect correlation with churn', 'Customer_Tickets.csv, Account_Plans.csv', 'Cross-table join consistency', 'Python Pandas regression analysis', 'R²: 0.74', 'Defect frequency accelerates churn by 32%'],
      ['Phase 3: Stabilization', 'Recommend QA gates for checkout flow', 'Sprint_Regression_Log.xlsx', 'Peer review & validation sign-off', 'Model predictive defect risk', 'Projected churn -15%', 'Immediate QA stabilization proposed'],
      ['Phase 4: Executive', 'Stakeholder presentation meeting', 'Executive_Summary.pdf, Tableau Board', 'Executive sign-off', 'Deliver roadmap & dashboard', 'Approved', 'Adopted by leadership for Q2 2026']
    ]
  }
}

interface TemplatePreviewModalProps {
  template: TemplatePreviewData | null
  onClose: () => void
  onDownload: (id: string, fileUrl: string, title: string) => void
}

export function TemplatePreviewModal({
  template,
  onClose,
  onDownload
}: TemplatePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (template) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [template, onClose])

  if (!template) return null

  const data = sampleRows[template.id] || {
    headers: template.includes,
    rows: [template.includes.map((col) => `Sample ${col} value`)]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl panel border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border/70 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 text-signal border border-signal/20">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-primary">
                  {template.category}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-border text-muted">
                  Interactive Sheet Preview
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mt-0.5">
                {template.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-white/[0.05] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Spreadsheet Grid */}
        <div className="flex-1 overflow-auto p-5 sm:p-6 space-y-4">
          <p className="text-sm text-muted leading-relaxed">
            {template.description}
          </p>

          <div className="rounded-xl border border-border/80 overflow-hidden bg-[#0a0d14]">
            {/* Table Mockup Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-border text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-signal" />
                <span>Sheet1 · {data.headers.length} Columns · {data.rows.length} Sample Records</span>
              </div>
              <span className="text-[11px] text-muted-dark">Read-only preview</span>
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto max-h-[46vh]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-white/[0.04] border-b border-border text-primary font-semibold">
                    <th className="p-3 border-r border-border/40 w-12 text-center text-muted-dark">#</th>
                    {data.headers.map((h, i) => (
                      <th key={i} className="p-3 border-r border-border/40 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-muted">
                  {data.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 border-r border-border/40 text-center text-muted-dark">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => {
                        const isPassed = cell === 'Passed' || cell === 'PASS'
                        const isCritical = cell === 'Critical'
                        const isResolved = cell === 'Resolved' || cell === 'REMEDIATED'
                        return (
                          <td
                            key={cIdx}
                            className="p-3 border-r border-border/40 whitespace-nowrap"
                          >
                            {isPassed ? (
                              <span className="inline-flex items-center gap-1 text-signal font-semibold">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {cell}
                              </span>
                            ) : isCritical ? (
                              <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                                {cell}
                              </span>
                            ) : isResolved ? (
                              <span className="inline-flex items-center gap-1 text-primary font-semibold">
                                {cell}
                              </span>
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 border-t border-border/70 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
            <span>Ready for Microsoft Excel, Google Sheets, or LibreOffice Calc</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-lg border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              Close
            </button>
            <a
              href={template.file_url}
              download
              onClick={() => {
                onDownload(template.id, template.file_url, template.title)
                onClose()
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg btn-signal h-9 px-5 text-xs font-semibold uppercase tracking-wider"
            >
              <Download className="h-3.5 w-3.5" />
              Download Spreadsheet (.xlsx)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
