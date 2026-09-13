import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import portfolioData from '@/data/portfolio.json'

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
    title: `${portfolioData.portfolio.owner.name} — IT Consultant & QA Analyst`,
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
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Fraunces:ital,opsz,wght@1,9..144,400..700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-sky-500/20 selection:text-sky-300">
        <AnalyticsTracker />
        <Navbar />
        <main className="flex-grow relative">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
