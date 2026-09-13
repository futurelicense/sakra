import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import portfolioData from '@/data/portfolio.json'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: `${portfolioData.portfolio.owner.name} | ${portfolioData.portfolio.owner.professional_title}`,
  description: portfolioData.portfolio.owner.tagline,
  keywords: [
    'Sakera Begum',
    'Software Quality Assurance',
    'QA Tester',
    'Data Analyst',
    'IT Consultant',
    'Test Automation',
    'Defect Tracking',
    'SQL',
    'Python',
  ],
  authors: [{ name: portfolioData.portfolio.owner.name }],
  openGraph: {
    title: `${portfolioData.portfolio.owner.name} - Professional Portfolio`,
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <AnalyticsTracker />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
