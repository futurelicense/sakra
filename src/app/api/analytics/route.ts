import { NextResponse } from 'next/server'
import { getMetrics, trackEvent } from '@/lib/metricsStore'

export async function GET() {
  const metrics = getMetrics()
  return NextResponse.json({
    success: true,
    data: metrics
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_name, id } = body

    if (!event_name) {
      return NextResponse.json({ success: false, error: 'event_name required' }, { status: 400 })
    }

    const updated = trackEvent(event_name, id)
    return NextResponse.json({
      success: true,
      data: updated
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 })
  }
}
