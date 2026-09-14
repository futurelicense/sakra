#!/usr/bin/env node

/**
 * Adds template download counts in Supabase (artificial drip).
 * Default: 2 downloads, split at random across the four templates.
 *
 *   node scripts/increment-downloads.mjs
 *   COUNT=2 node scripts/increment-downloads.mjs
 *   npm run increment-downloads
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const COUNT = Math.max(1, Number(process.env.COUNT ?? 2) || 2)
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
    body: JSON.stringify(body),
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
    process.exit(0)
  }
}

if (!response.ok) {
  const body = await response.text()
  console.error(`Download increment failed (${response.status}): ${body}`)
  console.error(
    'If this is a missing table/function, run supabase/migrations/20260913210000_site_stats_and_download_rpcs.sql in the Supabase SQL editor.'
  )
  process.exit(1)
}

const added = await response.json()
console.log(`Added ${added} download(s) across templates.`)
