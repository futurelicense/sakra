#!/usr/bin/env node

/**
 * Adeola-style hourly drip with a 3-step rotating sequence (UTC hour % 3):
 *   0 → 2 downloads + 1 visit
 *   1 → 1 download  + 3 visits
 *   2 → 5 downloads + 2 visits
 *
 * Override with COUNT / VISIT_COUNT, or SEQUENCE=0|1|2.
 *
 *   node scripts/increment-downloads.mjs
 *   SEQUENCE=2 node scripts/increment-downloads.mjs
 *   npm run increment-downloads
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SEQUENCES = [
  { downloads: 2, visits: 1, label: '2 downloads + 1 visit' },
  { downloads: 1, visits: 3, label: '1 download + 3 visits' },
  { downloads: 5, visits: 2, label: '5 downloads + 2 visits' },
]

function pickSequence() {
  if (process.env.SEQUENCE !== undefined && process.env.SEQUENCE !== '') {
    const idx = Number(process.env.SEQUENCE)
    if (Number.isInteger(idx) && idx >= 0 && idx < SEQUENCES.length) {
      return { index: idx, ...SEQUENCES[idx] }
    }
  }
  const idx = new Date().getUTCHours() % SEQUENCES.length
  return { index: idx, ...SEQUENCES[idx] }
}

const sequence = pickSequence()
const COUNT = Math.max(
  0,
  Number(process.env.COUNT ?? sequence.downloads) || sequence.downloads
)
const VISIT_COUNT = Math.max(
  0,
  Number(process.env.VISIT_COUNT ?? sequence.visits) || sequence.visits
)

const TEMPLATE_IDS = [
  'qa-test-case-template',
  'bug-tracking-template',
  'data-quality-checklist',
  'data-analysis-project-tracker',
]

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const raw of readFileSync(path, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(resolve(process.cwd(), '.env'))
loadEnvFile(resolve(process.cwd(), '.env.local'))

const supabaseUrl = (
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).replace(/\/+$/, '')
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ''

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_*). Add them as GitHub Actions secrets.'
  )
  process.exit(1)
}

console.log(
  `Sequence ${sequence.index + 1}/3 (${sequence.label}) → downloads=${COUNT}, visits=${VISIT_COUNT}`
)

function rpcHeaders() {
  const headers = {
    apikey: supabaseKey,
    'Content-Type': 'application/json',
  }
  if (!supabaseKey.startsWith('sb_publishable_') && !supabaseKey.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${supabaseKey}`
  }
  return headers
}

async function rpc(name, body) {
  return fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: rpcHeaders(),
    body: JSON.stringify(body ?? {}),
  })
}

if (COUNT > 0) {
  let response = await rpc('bump_download_counts', { p_count: COUNT })

  if (response.status === 404) {
    let added = 0
    for (let i = 0; i < COUNT; i += 1) {
      const id = TEMPLATE_IDS[Math.floor(Math.random() * TEMPLATE_IDS.length)]
      response = await rpc('register_download', { p_resource_id: id })
      if (!response.ok) break
      added += 1
    }
    if (response.ok) {
      console.log(`Added ${added} download(s) via register_download.`)
    } else {
      const body = await response.text()
      console.error(`Download increment failed (${response.status}): ${body}`)
      process.exit(1)
    }
  } else if (!response.ok) {
    const body = await response.text()
    console.error(`Download increment failed (${response.status}): ${body}`)
    console.error(
      'If this is a missing table/function, run supabase/migrations/*.sql in the Supabase SQL editor.'
    )
    process.exit(1)
  } else {
    const added = await response.json()
    console.log(`Added ${added} download(s) across templates.`)
  }
}

if (VISIT_COUNT > 0) {
  let visitRes = await rpc('bump_visit_counts', { p_count: VISIT_COUNT })
  if (visitRes.status === 404) {
    let addedVisits = 0
    for (let i = 0; i < VISIT_COUNT; i += 1) {
      visitRes = await rpc('register_visit', { is_new_visitor: false })
      if (!visitRes.ok) break
      addedVisits += 1
    }
    if (visitRes.ok) {
      console.log(`Added ${addedVisits} visit(s) via register_visit.`)
    } else {
      const body = await visitRes.text()
      console.warn(`Visit drip skipped (${visitRes.status}): ${body}`)
    }
  } else if (!visitRes.ok) {
    // Fallback if bump_visit_counts migration not applied yet
    let addedVisits = 0
    for (let i = 0; i < VISIT_COUNT; i += 1) {
      const res = await rpc('register_visit', { is_new_visitor: false })
      if (!res.ok) {
        const body = await res.text()
        console.warn(`Visit drip skipped (${res.status}): ${body}`)
        break
      }
      addedVisits += 1
    }
    if (addedVisits > 0) {
      console.log(`Added ${addedVisits} visit(s) via register_visit.`)
    }
  } else {
    const addedVisits = await visitRes.json()
    console.log(`Added ${addedVisits} visit(s).`)
  }
}
