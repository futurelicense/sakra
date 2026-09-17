import type { Metadata } from 'next'
import './globals.css'
import { SiteShell } from '@/components/SiteShell'
import portfolioData from '@/data/portfolio'

export const metadata: Metadata = {
  title: `${portfolioData.portfolio.owner.name} | ${portfolioData.portfolio.owner.professional_title}`,
  description: portfolioData.portfolio.owner.tagline,
  keywords: [
    'Sakera Begum',
    'Software Quality Assurance',
    'QA Analyst',
    'Data Analyst',
    'Doctor of Computer Science',
    'Test Automation',
    'Defect Tracking',
    'SQL',
    'Python',
  ],
  authors: [{ name: portfolioData.portfolio.owner.name }],
  openGraph: {
    title: `${portfolioData.portfolio.owner.name} - IT Consultant & QA Analyst`,
    description: portfolioData.portfolio.owner.tagline,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Fraunces:ital,opsz,wght@1,9..144,400..700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-teal-600/15 selection:text-teal-900">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
