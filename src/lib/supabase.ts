import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

const FETCH_TIMEOUT_MS = 45_000

/**
 * Native fetch with an AbortController timeout.
 * Avoid setGlobalDispatcher/undici Agent overrides — they break in some
 * Node/Next/Vercel runtimes and cause silent "in-memory" analytics fallbacks.
 */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
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

export function supabaseConfigHint() {
  const hasUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const hasKey = Boolean(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  if (hasUrl && hasKey) return null
  const missing = [
    !hasUrl ? 'SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)' : null,
    !hasKey ? 'SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)' : null,
  ].filter(Boolean)
  return `Missing env: ${missing.join(', ')}. Set them in .env locally and in the Vercel project settings.`
}
