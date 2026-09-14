/** Generates a plausible private/public-looking IPv4 for local analytics until real IPs are wired via Supabase. */
export function generateDummyIp(): string {
  const pools = [
    () => `10.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`,
    () => `172.${rand(16, 31)}.${rand(0, 255)}.${rand(1, 254)}`,
    () => `192.168.${rand(0, 255)}.${rand(1, 254)}`,
    () => `${rand(20, 220)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`,
  ]
  return pools[rand(0, pools.length - 1)]()
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
