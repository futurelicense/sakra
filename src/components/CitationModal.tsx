'use client'

import React, { useState, useEffect } from 'react'
import { X, Copy, Check, BookOpen, Quote } from 'lucide-react'

export interface PublicationCitationData {
  id: string
  title: string
  authors: string[]
  publication_type: string
  journal_or_conference: string
  year: string
  doi?: string
}

interface CitationModalProps {
  publication: PublicationCitationData | null
  onClose: () => void
}

export function CitationModal({ publication, onClose }: CitationModalProps) {
  const [activeFormat, setActiveFormat] = useState<'APA' | 'IEEE' | 'BibTeX'>('APA')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (publication) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [publication, onClose])

  if (!publication) return null

  const authorsString = publication.authors.join(', ')
  const doiStr = publication.doi ? ` https://doi.org/${publication.doi}` : ''

  const citations = {
    APA: `${authorsString}. (${publication.year}). ${publication.title}. ${publication.journal_or_conference}.${doiStr}`,
    IEEE: `${authorsString}, "${publication.title}," ${publication.journal_or_conference}, ${publication.year}.${doiStr}`,
    BibTeX: `@article{begum${publication.year}${publication.id.replace(/[^a-zA-Z0-9]/g, '')},
  author = {${publication.authors.join(' and ')}},
  title = {${publication.title}},
  journal = {${publication.journal_or_conference}},
  year = {${publication.year}}${publication.doi ? `,\n  doi = {${publication.doi}}` : ''}
}`
  }

  const currentText = citations[activeFormat]

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl rounded-2xl panel border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/70 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Quote className="h-4 w-4" />
            </span>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-primary">
                Citation Generator
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Cite this Research Paper
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:text-foreground hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            {(['APA', 'IEEE', 'BibTeX'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeFormat === fmt
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-white text-muted hover:text-foreground border border-border/60'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-border font-mono text-slate-700 text-xs text-muted leading-relaxed select-all overflow-x-auto whitespace-pre-wrap">
            {currentText}
          </div>
        </div>

        <div className="flex items-center justify-between p-5 border-t border-border/70 bg-slate-50">
          <span className="text-xs font-mono text-muted">
            {copied ? 'Citation copied to clipboard!' : 'Click copy to paste into references'}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg btn-signal h-9 px-4 text-xs font-semibold uppercase tracking-wider"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-foreground" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Citation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
