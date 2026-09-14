# Sakera Begum - IT Consultant & QA Analyst Portfolio

A high-performance modern web application built from the portfolio specification for **Sakera Begum** (Doctor of Computer Science researcher, IT Consultant, Data Analyst, and Software Quality Assurance specialist).

## Features

- **Hero & Verified Metrics**: Dynamic visitor tracking, years of experience, executed test cases, and analyzed records with real-time incrementing counters.
- **Career Timeline (`/experience`)**: Filterable timeline across roles (UpSkill Consultancy, TaskInspota, WUST, British IELTS) with quantified achievements and defect tracking metrics.
- **Research & Publications (`/publications`)**: Peer-reviewed journal papers, IEEE conference papers, and doctoral working papers with abstract viewers and direct PDF downloads.
- **Free Professional Templates (`/templates`)**: Production-ready QA test case matrices, bug tracking sheets, data validation checklists, and project trackers ready for download.
- **Interactive Resume (`/resume`)**: Formatted CV with executive summary, competencies, education, and single-click PDF export.
- **LinkedIn Hub (`/linkedin`)**: Direct social connections and curated thought leadership previews.
- **Analytics API (`/api/analytics`)**: Endpoints for tracking page visits, template downloads, publication citations, and resume downloads.
- **Admin dashboard (`/admin`)**: Live counters for portfolio visits, page views, paper reads, resume/template/PDF downloads, plus a download log with dummy IP addresses (in-memory until Supabase is wired).
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

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)  
Login: username `admin` / password from `ADMIN_PASSWORD` in `.env`

### 3. Supabase setup (required for persistent analytics)
1. Copy `.env.example` to `.env` and set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
2. In the Supabase SQL Editor, run the full script in `supabase/schema.sql`.
3. Restart `npm run dev`. The admin dashboard should show **Supabase** as the storage backend.

### 4. Build for production
```bash
npm run build
npm run start
```
