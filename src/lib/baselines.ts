import portfolioData from '@/data/portfolio.json'

const { home, free_templates, publications } = portfolioData.portfolio

/** Adeola-style seed floors — live counters never display below these. */
export const BASELINE_TOTAL_VISITS = Number(
  home.metrics.find((m) => m.id === 'website_visits')?.value ?? 1462
)

export const BASELINE_UNIQUE_VISITORS = 980

export const BASELINE_TEMPLATE_DOWNLOADS: Record<string, number> = Object.fromEntries(
  free_templates.templates.map((t) => [t.id, Number(t.download_count ?? 0)])
)

export const BASELINE_PUBLICATION_VIEWS: Record<string, number> = Object.fromEntries(
  publications.items.map((p) => [p.id, Number(p.views ?? 0)])
)

export function floorVisits(total: number | null | undefined) {
  const n = Number(total ?? 0)
  return Math.max(n, BASELINE_TOTAL_VISITS)
}

export function floorUnique(total: number | null | undefined) {
  const n = Number(total ?? 0)
  return Math.max(n, BASELINE_UNIQUE_VISITORS)
}

export function floorTemplateDownloads(map: Record<string, number> | null | undefined) {
  const out: Record<string, number> = { ...BASELINE_TEMPLATE_DOWNLOADS }
  if (!map) return out
  for (const [id, count] of Object.entries(map)) {
    out[id] = Math.max(Number(count) || 0, BASELINE_TEMPLATE_DOWNLOADS[id] ?? 0)
  }
  return out
}
