import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Agent, setGlobalDispatcher } from 'undici'

let client: SupabaseClient | null = null
let dispatcherReady = false

/** High-latency / cold links need more than undici's default 10s connect timeout. */
function ensureDispatcher() {
  if (dispatcherReady) return
  setGlobalDispatcher(
    new Agent({
      connectTimeout: 30_000,
      headersTimeout: 30_000,
      bodyTimeout: 60_000,
      keepAliveTimeout: 10_000,
    })
  )
  dispatcherReady = true
}

const FETCH_TIMEOUT_MS = 45_000

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  ensureDispatcher()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  const parentSignal = init?.signal
  if (parentSignal) {
    if (parentSignal.aborted) controller.abort()
    else parentSignal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeout))
}

export function getSupabase(): SupabaseClient | null {
  ensureDispatcher()

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return null

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: fetchWithTimeout },
    })
  }

  return client
}

export function isSupabaseConfigured() {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  )
}
