#!/usr/bin/env node

/**
 * Adeola-style drip: template downloads (+ optional visit bump).
 * Default: 2 downloads across templates, 1 visit.
 *
 *   node scripts/increment-downloads.mjs
 *   COUNT=2 VISIT_COUNT=1 node scripts/increment-downloads.mjs
 *   npm run increment-downloads
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const COUNT = Math.max(1, Number(process.env.COUNT ?? 2) || 2)
const VISIT_COUNT = Math.max(0, Number(process.env.VISIT_COUNT ?? 1) || 0)
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
    const body = await visitRes.text()
    console.warn(`Visit drip skipped (${visitRes.status}): ${body}`)
  } else {
    const addedVisits = await visitRes.json()
    console.log(`Added ${addedVisits} visit(s).`)
  }
}
