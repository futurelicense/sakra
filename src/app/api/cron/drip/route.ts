import { NextResponse } from 'next/server'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import { resourceTemplateIds } from '@/lib/templateIds'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const SEQUENCES = [
  { downloads: 2, visits: 1, label: '2 downloads + 1 visit' },
  { downloads: 1, visits: 3, label: '1 download + 3 visits' },
  { downloads: 5, visits: 2, label: '5 downloads + 2 visits' },
] as const

function pickSequence(sequenceOverride?: string | null) {
  if (sequenceOverride !== undefined && sequenceOverride !== null && sequenceOverride !== '') {
    const idx = Number(sequenceOverride)
    if (Number.isInteger(idx) && idx >= 0 && idx < SEQUENCES.length) {
      return { index: idx, ...SEQUENCES[idx] }
    }
  }
  const idx = new Date().getUTCHours() % SEQUENCES.length
  return { index: idx, ...SEQUENCES[idx] }
}

function authorize(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') || ''
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : ''
  const query = new URL(request.url).searchParams.get('secret') || ''
  return bearer === secret || query === secret
}

async function bumpDownloads(supabase: NonNullable<ReturnType<typeof getSupabase>>, count: number) {
  if (count < 1) return 0
  const { data, error } = await supabase.rpc('bump_download_counts', { p_count: count })
  if (!error) return Number(data ?? count)

  let added = 0
  for (let i = 0; i < count; i += 1) {
    const id = resourceTemplateIds[Math.floor(Math.random() * resourceTemplateIds.length)]
    const res = await supabase.rpc('register_download', { p_resource_id: id })
    if (res.error) break
    added += 1
  }
  return added
}

async function bumpVisits(supabase: NonNullable<ReturnType<typeof getSupabase>>, count: number) {
  if (count < 1) return 0
  const { data, error } = await supabase.rpc('bump_visit_counts', { p_count: count })
  if (!error) return Number(data ?? count)

  let added = 0
  for (let i = 0; i < count; i += 1) {
    const res = await supabase.rpc('register_visit', { is_new_visitor: false })
    if (res.error) break
    added += 1
  }
  return added
}

async function runDrip(sequenceOverride?: string | null) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Supabase not configured on this deployment' },
      { status: 500 }
    )
  }
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase client unavailable' }, { status: 500 })
  }

  const sequence = pickSequence(sequenceOverride)
  const downloads = await bumpDownloads(supabase, sequence.downloads)
  const visits = await bumpVisits(supabase, sequence.visits)

  return NextResponse.json({
    success: true,
    sequence: sequence.index + 1,
    label: sequence.label,
    added: { downloads, visits },
  })
}

/** Vercel Cron + manual/GitHub triggers. */
export async function GET(request: Request) {
  // Vercel Cron sends this header; also allow Bearer CRON_SECRET.
  const isVercelCron = Boolean(request.headers.get('x-vercel-cron'))
  if (!isVercelCron && !authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const sequence = new URL(request.url).searchParams.get('sequence')
  return runDrip(sequence)
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  let sequence: string | null = null
  try {
    const body = await request.json()
    sequence = body?.sequence != null ? String(body.sequence) : null
  } catch {
    sequence = new URL(request.url).searchParams.get('sequence')
  }
  return runDrip(sequence)
}
