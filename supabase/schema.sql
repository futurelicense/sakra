-- Schema definitions for Sakera Begum's Portfolio Database
-- Compatible with Supabase / PostgreSQL

-- 1. Site Metrics
CREATE TABLE IF NOT EXISTS site_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) UNIQUE NOT NULL,
  metric_value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial metrics
INSERT INTO site_metrics (metric_name, metric_value) VALUES
  ('website_visits', 1420),
  ('unique_visitors', 980),
  ('resume_downloads', 135),
  ('linkedin_clicks', 86),
  ('github_clicks', 42)
ON CONFLICT (metric_name) DO NOTHING;

-- 2. Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  download_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed templates
INSERT INTO templates (id, title, description, category, file_url, download_count) VALUES
  ('qa-test-case-template', 'Software QA Test Case Template', 'Plan, document, execute, and monitor software test cases using a structured quality assurance worksheet.', 'Software Quality Assurance', '/downloads/software-qa-test-case-template.xlsx', 184),
  ('bug-tracking-template', 'Software Defect & Bug Tracking Template', 'A structured tracker for documenting, prioritizing, assigning, and monitoring software defects.', 'Software Quality Assurance', '/downloads/software-defect-bug-tracker.xlsx', 142),
  ('data-quality-checklist', 'Data Quality & Validation Checklist', 'A reusable framework for assessing data completeness, accuracy, consistency, duplicates, missing values, and analytical readiness.', 'Data Analytics', '/downloads/data-quality-validation-checklist.xlsx', 219),
  ('data-analysis-project-tracker', 'Data Analysis Project Tracker', 'Manage an analytics project from data collection and cleaning through exploration, visualization, findings, and reporting.', 'Data Analytics', '/downloads/data-analysis-project-tracker.xlsx', 165)
ON CONFLICT (id) DO NOTHING;

-- 3. Template Downloads Tracking Log
CREATE TABLE IF NOT EXISTS template_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(100) REFERENCES templates(id) ON DELETE CASCADE,
  visitor_id VARCHAR(255),
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Publications Table
CREATE TABLE IF NOT EXISTS publications (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  authors TEXT[] NOT NULL,
  publication_type VARCHAR(100) NOT NULL,
  journal VARCHAR(255),
  year VARCHAR(10) NOT NULL,
  abstract TEXT NOT NULL,
  doi VARCHAR(255),
  external_url TEXT,
  pdf_url TEXT NOT NULL,
  view_count INT DEFAULT 0 NOT NULL,
  download_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed publications
INSERT INTO publications (id, title, authors, publication_type, journal, year, abstract, doi, external_url, pdf_url, view_count, download_count) VALUES
  ('pub-1', 'Machine Learning and Automated Defect Prediction in Agile QA Pipelines', ARRAY['Sakera Begum', 'Research Collaborators'], 'Published Research', 'International Journal of Software Engineering & Quality Assurance (IJSEQA)', '2025', 'This paper investigates predictive machine learning models integrated within CI/CD pipelines to forecast regression defects before deployment.', '10.1016/j.ijseqa.2025.10482', 'https://doi.org/10.1016/j.ijseqa.2025.10482', '/downloads/publications/Sakera_Begum_Defect_Prediction_2025.pdf', 328, 94),
  ('pub-2', 'Data Cleansing and Integrity Validation Frameworks for Heterogeneous Enterprise Datasets', ARRAY['Sakera Begum'], 'Conference Papers', 'Proceedings of the IEEE International Conference on Big Data and Information Systems', '2024', 'Enterprise analytics are heavily vulnerable to noise and inconsistent schemas in merged operational data.', '10.1109/ICBDIS.2024.98124', 'https://doi.org/10.1109/ICBDIS.2024.98124', '/downloads/publications/Sakera_Begum_Data_Cleansing_2024.pdf', 215, 67),
  ('pub-3', 'Benchmarking Test Automation Frameworks for Web and Mobile Cloud Environments', ARRAY['Sakera Begum', 'Doctoral Seminar Committee'], 'Working Papers', 'Doctor of Computer Science Working Paper Series, WUST', '2026', 'A comprehensive comparative study assessing performance, maintenance overhead, and reliability across modern test automation suites.', NULL, NULL, '/downloads/publications/Sakera_Begum_QA_Benchmarking_2026.pdf', 180, 49)
ON CONFLICT (id) DO NOTHING;

-- 5. Site Visits Table (Individual event logging)
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(255),
  page VARCHAR(255) NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. External Clicks Table
CREATE TABLE IF NOT EXISTS external_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_type VARCHAR(100) NOT NULL,
  target_url TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
