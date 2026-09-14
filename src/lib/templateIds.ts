/** Allowed template download IDs (must match register_download / bump_download_counts). */
export const resourceTemplateIds = [
  'qa-test-case-template',
  'bug-tracking-template',
  'data-quality-checklist',
  'data-analysis-project-tracker',
] as const

export type ResourceTemplateId = (typeof resourceTemplateIds)[number]

export function isResourceTemplateId(id: string): id is ResourceTemplateId {
  return (resourceTemplateIds as readonly string[]).includes(id)
}
