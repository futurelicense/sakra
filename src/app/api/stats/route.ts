import { NextResponse } from 'next/server'
import { getMetrics, trackEvent } from '@/lib/metricsStore'
import { getSupabase, isSupabaseConfigured, supabaseConfigHint } from '@/lib/supabase'
import { isResourceTemplateId } from '@/lib/templateIds'

export const maxDuration = 60

export async function GET() {
  const metrics = await getMetrics()
  const configured = isSupabaseConfigured()
  return NextResponse.json({
    success: true,
    supabase_configured: configured,
    // Non-secret hint only — never returns key/url values
    supabase_hint: configured ? null : supabaseConfigHint(),
    data: {
      total_visits: metrics.website_visits,
      monthly_visits: metrics.monthly_visits,
      unique_visitors: metrics.unique_visitors,
      template_downloads: metrics.template_downloads || {},
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = body?.action as string | undefined

    if (action === 'visit') {
      const isNewVisitor = Boolean(body?.is_new_visitor)
      const supabase = getSupabase()

      if (supabase && isSupabaseConfigured()) {
        const { data, error } = await supabase.rpc('register_visit', {
          is_new_visitor: isNewVisitor,
        })
        if (!error) {
          const row = Array.isArray(data) ? data[0] : data
          return NextResponse.json({
            success: true,
            data: {
              total_visits: Number(row?.total_visits ?? 0),
              monthly_visits: Number(row?.monthly_visits ?? 0),
              unique_visitors: Number(row?.unique_visitors ?? 0),
            },
          })
        }
      }

      const updated = await trackEvent('website_visit', { path: body?.path || '/' })
      return NextResponse.json({
        success: true,
        data: {
          total_visits: updated.website_visits,
          monthly_visits: updated.monthly_visits,
          unique_visitors: updated.unique_visitors,
        },
      })
    }

    if (action === 'download') {
      const resourceId = body?.id as string | undefined
      if (!resourceId || !isResourceTemplateId(resourceId)) {
        return NextResponse.json({ success: false, error: 'Unknown template' }, { status: 400 })
      }

      const supabase = getSupabase()
      if (supabase && isSupabaseConfigured()) {
        const { data, error } = await supabase.rpc('register_download', {
          p_resource_id: resourceId,
        })
        if (!error) {
          return NextResponse.json({
            success: true,
            data: { id: resourceId, download_count: Number(data ?? 0) },
          })
        }
      }

      const updated = await trackEvent('template_download', {
        id: resourceId,
        path: body?.path || '/templates',
        label: body?.label,
      })
      return NextResponse.json({
        success: true,
        data: {
          id: resourceId,
          download_count: Number(updated.template_downloads?.[resourceId] ?? 0),
        },
      })
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 })
  }
}
