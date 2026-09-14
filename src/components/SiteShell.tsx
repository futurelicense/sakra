'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { SystemTelemetryDock } from '@/components/SystemTelemetryDock'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <AnalyticsTracker />
      <Navbar />
      <main className="flex-grow relative">{children}</main>
      <SystemTelemetryDock />
      <Footer />
    </>
  )
}
