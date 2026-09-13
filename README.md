# Sakera Begum — IT Consultant & QA Analyst Portfolio

A high-performance modern web application built from the portfolio specification for **Sakera Begum** (Doctor of Computer Science researcher, IT Consultant, Data Analyst, and Software Quality Assurance specialist).

## Features

- **Hero & Verified Metrics**: Dynamic visitor tracking, years of experience, executed test cases, and analyzed records with real-time incrementing counters.
- **Career Timeline (`/experience`)**: Filterable timeline across roles (UpSkill Consultancy, TaskInspota, WUST, British IELTS) with quantified achievements and defect tracking metrics.
- **Research & Publications (`/publications`)**: Peer-reviewed journal papers, IEEE conference papers, and doctoral working papers with abstract viewers and direct PDF downloads.
- **Free Professional Templates (`/templates`)**: Production-ready QA test case matrices, bug tracking sheets, data validation checklists, and project trackers ready for download.
- **Interactive Resume (`/resume`)**: Formatted CV with executive summary, competencies, education, and single-click PDF export.
- **LinkedIn Hub (`/linkedin`)**: Direct social connections and curated thought leadership previews.
- **Analytics API (`/api/analytics`)**: Endpoints for tracking page visits, template downloads, publication citations, and resume downloads.
- **Supabase / Postgres Ready**: Complete SQL schema included in `supabase/schema.sql` for instant database synchronization.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Analytics**: Next.js Server Route handlers + In-memory store + Supabase schema

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Build for production
```bash
npm run build
npm run start
```

### 4. Optional Supabase Database Setup
Execute `supabase/schema.sql` in your Supabase SQL Editor to provision persistent database tables for site metrics, templates, downloads, and publications.
