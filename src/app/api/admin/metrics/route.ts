import { NextResponse } from 'next/server'
import { getAdminSnapshot, resetSupabaseCircuit } from '@/lib/metricsStore'
import {
  createAdminToken,
  isValidAdminCredentials,
  isValidAdminToken,
} from '@/lib/adminAuth'

/** Supabase round-trips from cold regions can exceed the default 10s hobby limit. */
export const maxDuration = 60

export async function GET(request: Request) {
  const token = request.headers.get('x-admin-token')
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  resetSupabaseCircuit()

  return NextResponse.json({
    success: true,
    data: await getAdminSnapshot(),
    refreshed_at: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body?.username || '').trim()
    const password = String(body?.password || '')

    if (!isValidAdminCredentials(username, password)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: 'Authenticated',
      token: createAdminToken(username, password),
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 })
  }
}
