/**
 * Simulate analytics at different frequencies.
 *
 * Default: write directly to Supabase RPC (reliable).
 * Optional: SIM_MODE=http to hit local /api/analytics instead.
 *
 * Rates:
 *   website_visit         every 2s
 *   publication_view      every 4s
 *   template_download     every 6s
 *   publication_download  every 8s
 *   resume_download       every 10s
 *   linkedin_click        every 12s
 *   github_click          every 15s
 *
 * Usage:
 *   node scripts/simulate-analytics.js
 *   SIM_DURATION_MS=60000 node scripts/simulate-analytics.js
 */
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  })
}

const MODE = process.env.SIM_MODE || 'supabase'
const BASE = process.env.SIM_BASE_URL || 'http://localhost:3000'
const DURATION = Number(process.env.SIM_DURATION_MS) || 40000

const PATHS = ['/', '/experience', '/publications', '/templates', '/resume']
const TEMPLATES = [
  ['qa-test-case-template', 'Software QA Test Case Template'],
  ['bug-tracking-template', 'Software Defect & Bug Tracking Template'],
  ['data-quality-checklist', 'Data Quality & Validation Checklist'],
  ['data-analysis-project-tracker', 'Data Analysis Project Tracker'],
]
const PUBS = ['pub-1', 'pub-2', 'pub-3']

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function dummyIp() {
  return `203.${rand(0, 200)}.${rand(0, 255)}.${rand(1, 254)}`
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function trackHttp(event, extra = {}) {
  const res = await fetch(`${BASE}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_name: event, ...extra }),
  })
  if (!res.ok) throw new Error(`${event} http ${res.status}`)
}

async function createTracker() {
  if (MODE === 'http') return trackHttp

  const { createClient } = require('@supabase/supabase-js')
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return async function trackSupabase(event, extra = {}) {
    const { error } = await sb.rpc('track_portfolio_event', {
      p_event: event,
      p_id: extra.id ?? null,
      p_path: extra.path ?? null,
      p_label: extra.label ?? null,
      p_ip: extra.ip ?? dummyIp(),
    })
    if (error) throw new Error(`${event}: ${error.message}`)
  }
}

async function main() {
  const track = await createTracker()
  const counts = {
    visit: 0,
    paper: 0,
    template: 0,
    pdf: 0,
    resume: 0,
    linkedin: 0,
    github: 0,
    errors: 0,
  }

  console.log(`Mode=${MODE} duration=${DURATION / 1000}s`)
  console.log('Rates: visits 2s | papers 4s | templates 6s | PDFs 8s | resume 10s | social 12–15s\n')

  const started = Date.now()
  const next = { visit: 0, paper: 0, template: 0, pdf: 0, resume: 0, linkedin: 0, github: 0 }

  while (Date.now() - started < DURATION) {
    const elapsed = Date.now() - started
    const queue = []

    if (elapsed >= next.visit) {
      const p = PATHS[counts.visit % PATHS.length]
      queue.push(async () => {
        await track('website_visit', { path: p })
        counts.visit++
        process.stdout.write('v')
      })
      next.visit = elapsed + 2000
    }
    if (elapsed >= next.paper) {
      const id = PUBS[counts.paper % PUBS.length]
      queue.push(async () => {
        await track('publication_view', { id, path: '/publications' })
        counts.paper++
        process.stdout.write('p')
      })
      next.paper = elapsed + 4000
    }
    if (elapsed >= next.template) {
      const [id, label] = TEMPLATES[counts.template % TEMPLATES.length]
      queue.push(async () => {
        await track('template_download', { id, label, path: '/templates' })
        counts.template++
        process.stdout.write('t')
      })
      next.template = elapsed + 6000
    }
    if (elapsed >= next.pdf) {
      const id = PUBS[counts.pdf % PUBS.length]
      queue.push(async () => {
        await track('publication_download', { id, path: '/publications' })
        counts.pdf++
        process.stdout.write('d')
      })
      next.pdf = elapsed + 8000
    }
    if (elapsed >= next.resume) {
      queue.push(async () => {
        await track('resume_download', { path: '/resume', label: 'Curriculum Vitae (PDF)' })
        counts.resume++
        process.stdout.write('r')
      })
      next.resume = elapsed + 10000
    }
    if (elapsed >= next.linkedin) {
      queue.push(async () => {
        await track('linkedin_click')
        counts.linkedin++
        process.stdout.write('L')
      })
      next.linkedin = elapsed + 12000
    }
    if (elapsed >= next.github) {
      queue.push(async () => {
        await track('github_click')
        counts.github++
        process.stdout.write('G')
      })
      next.github = elapsed + 15000
    }

    if (!queue.length) {
      await sleep(200)
      continue
    }

    for (const job of queue) {
      try {
        await job()
      } catch (e) {
        counts.errors++
        process.stdout.write('!')
        console.error('\n' + e.message)
      }
      await sleep(150)
    }
  }

  console.log('\n\nFired:', counts)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
