/** Admin gate via env credentials. */
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sa10NiA'

export function isValidAdminCredentials(
  username: string | null | undefined,
  password: string | null | undefined
) {
  return Boolean(
    username &&
      password &&
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
  )
}

export function createAdminToken(username: string, password: string) {
  return Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
}

export function parseAdminToken(token: string | null | undefined) {
  if (!token) return null
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const idx = decoded.indexOf(':')
    if (idx < 0) return null
    return {
      username: decoded.slice(0, idx),
      password: decoded.slice(idx + 1),
    }
  } catch {
    return null
  }
}

export function isValidAdminToken(token: string | null | undefined) {
  const parsed = parseAdminToken(token)
  if (!parsed) return false
  return isValidAdminCredentials(parsed.username, parsed.password)
}
