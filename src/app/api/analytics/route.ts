import { NextResponse } from 'next/server'
import { getMetrics, trackEvent } from '@/lib/metricsStore'

export async function GET() {
  const metrics = await getMetrics()
  return NextResponse.json({
    success: true,
    data: metrics,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_name, id, path, label } = body

    if (!event_name) {
      return NextResponse.json({ success: false, error: 'event_name required' }, { status: 400 })
    }

    const updated = await trackEvent(event_name, { id, path, label })
    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 })
  }
}
