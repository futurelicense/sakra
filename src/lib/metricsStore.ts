import fs from 'fs'
import path from 'path'

// Path to data file
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json')

export interface MetricsState {
  website_visits: number
  unique_visitors: number
  resume_downloads: number
  template_downloads: Record<string, number>
  publication_views: Record<string, number>
  publication_downloads: Record<string, number>
  linkedin_clicks: number
  github_clicks: number
}

// In-memory fallback and initialized metrics
let metrics: MetricsState = {
  website_visits: 1420,
  unique_visitors: 980,
  resume_downloads: 135,
  template_downloads: {
    'qa-test-case-template': 184,
    'bug-tracking-template': 142,
    'data-quality-checklist': 219,
    'data-analysis-project-tracker': 165
  },
  publication_views: {
    'pub-1': 328,
    'pub-2': 215,
    'pub-3': 180
  },
  publication_downloads: {
    'pub-1': 94,
    'pub-2': 67,
    'pub-3': 49
  },
  linkedin_clicks: 86,
  github_clicks: 42
}

export function getMetrics(): MetricsState {
  return metrics
}

export function trackEvent(eventType: string, id?: string) {
  switch (eventType) {
    case 'website_visit':
      metrics.website_visits += 1
      break
    case 'resume_download':
      metrics.resume_downloads += 1
      break
    case 'template_download':
      if (id) {
        metrics.template_downloads[id] = (metrics.template_downloads[id] || 0) + 1
      }
      break
    case 'publication_view':
      if (id) {
        metrics.publication_views[id] = (metrics.publication_views[id] || 0) + 1
      }
      break
    case 'publication_download':
      if (id) {
        metrics.publication_downloads[id] = (metrics.publication_downloads[id] || 0) + 1
      }
      break
    case 'linkedin_click':
      metrics.linkedin_clicks += 1
      break
    case 'github_click':
      metrics.github_clicks += 1
      break
    default:
      break
  }
  return metrics
}
