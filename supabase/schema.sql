-- Sakera portfolio analytics schema (Supabase / PostgreSQL)
-- Run this once in the Supabase SQL Editor.

-- 1. Site Metrics
CREATE TABLE IF NOT EXISTS site_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) UNIQUE NOT NULL,
  metric_value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO site_metrics (metric_name, metric_value) VALUES
  ('website_visits', 1420),
  ('unique_visitors', 980),
  ('resume_downloads', 135),
  ('linkedin_clicks', 86),
  ('github_clicks', 42),
  ('page_view:/', 620),
  ('page_view:/experience', 210),
  ('page_view:/publications', 285),
  ('page_view:/templates', 190),
  ('page_view:/resume', 115)
ON CONFLICT (metric_name) DO NOTHING;

-- 2. Templates
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

INSERT INTO templates (id, title, description, category, file_url, download_count) VALUES
  ('qa-test-case-template', 'Software QA Test Case Template', 'Plan, document, execute, and monitor software test cases using a structured quality assurance worksheet.', 'Software Quality Assurance', '/downloads/software-qa-test-case-template.xlsx', 184),
  ('bug-tracking-template', 'Software Defect & Bug Tracking Template', 'A structured tracker for documenting, prioritizing, assigning, and monitoring software defects.', 'Software Quality Assurance', '/downloads/software-defect-bug-tracker.xlsx', 142),
  ('data-quality-checklist', 'Data Quality & Validation Checklist', 'A reusable framework for assessing data completeness, accuracy, consistency, duplicates, missing values, and analytical readiness.', 'Data Analytics', '/downloads/data-quality-validation-checklist.xlsx', 219),
  ('data-analysis-project-tracker', 'Data Analysis Project Tracker', 'Manage an analytics project from data collection and cleaning through exploration, visualization, findings, and reporting.', 'Data Analytics', '/downloads/data-analysis-project-tracker.xlsx', 165)
ON CONFLICT (id) DO NOTHING;

-- 3. Download events log (with IP)
CREATE TABLE IF NOT EXISTS download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  asset_id VARCHAR(100) NOT NULL,
  asset_label TEXT NOT NULL,
  ip_address VARCHAR(64),
  path VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_download_events_created_at ON download_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_download_events_type ON download_events (event_type);

-- 4. Publications
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

INSERT INTO publications (id, title, authors, publication_type, journal, year, abstract, doi, external_url, pdf_url, view_count, download_count) VALUES
  ('pub-1', 'Machine Learning and Automated Defect Prediction in Agile QA Pipelines', ARRAY['Sakera Begum', 'Research Collaborators'], 'Published Research', 'International Journal of Software Engineering & Quality Assurance (IJSEQA)', '2025', 'This paper investigates predictive machine learning models integrated within CI/CD pipelines to forecast regression defects before deployment.', '10.1016/j.ijseqa.2025.10482', 'https://doi.org/10.1016/j.ijseqa.2025.10482', '/downloads/publications/Sakera_Begum_Defect_Prediction_2025.pdf', 328, 94),
  ('pub-2', 'Data Cleansing and Integrity Validation Frameworks for Heterogeneous Enterprise Datasets', ARRAY['Sakera Begum'], 'Conference Papers', 'Proceedings of the IEEE International Conference on Big Data and Information Systems', '2024', 'Enterprise analytics are heavily vulnerable to noise and inconsistent schemas in merged operational data.', '10.1109/ICBDIS.2024.98124', 'https://doi.org/10.1109/ICBDIS.2024.98124', '/downloads/publications/Sakera_Begum_Data_Cleansing_2024.pdf', 215, 67),
  ('pub-3', 'Benchmarking Test Automation Frameworks for Web and Mobile Cloud Environments', ARRAY['Sakera Begum', 'Doctoral Seminar Committee'], 'Working Papers', 'Doctor of Computer Science Working Paper Series, University of the Potomac', '2026', 'A comprehensive comparative study assessing performance, maintenance overhead, and reliability across modern test automation suites.', NULL, NULL, '/downloads/publications/Sakera_Begum_QA_Benchmarking_2026.pdf', 180, 49)
ON CONFLICT (id) DO NOTHING;

-- 5. Site visits
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(255),
  page VARCHAR(255) NOT NULL,
  ip_address VARCHAR(64),
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON site_visits (visited_at DESC);

-- 6. External clicks
CREATE TABLE IF NOT EXISTS external_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_type VARCHAR(100) NOT NULL,
  target_url TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helpers
CREATE OR REPLACE FUNCTION increment_site_metric(p_name text, p_by bigint DEFAULT 1)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v bigint;
BEGIN
  INSERT INTO site_metrics (metric_name, metric_value)
  VALUES (p_name, p_by)
  ON CONFLICT (metric_name)
  DO UPDATE SET
    metric_value = site_metrics.metric_value + EXCLUDED.metric_value,
    updated_at = timezone('utc'::text, now())
  RETURNING metric_value INTO v;
  RETURN v;
END;
$$;

CREATE OR REPLACE FUNCTION track_portfolio_event(
  p_event text,
  p_id text DEFAULT NULL,
  p_path text DEFAULT NULL,
  p_label text DEFAULT NULL,
  p_ip text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip text := COALESCE(NULLIF(p_ip, ''), '0.0.0.0');
  v_path text := COALESCE(NULLIF(p_path, ''), '/');
  v_label text;
BEGIN
  IF p_event = 'website_visit' THEN
    PERFORM increment_site_metric('website_visits', 1);
    PERFORM increment_site_metric('page_view:' || v_path, 1);
    INSERT INTO site_visits (page, ip_address) VALUES (v_path, v_ip);

  ELSIF p_event = 'resume_download' THEN
    PERFORM increment_site_metric('resume_downloads', 1);
    INSERT INTO download_events (event_type, asset_id, asset_label, ip_address, path)
    VALUES ('resume', 'resume', COALESCE(NULLIF(p_label, ''), 'Curriculum Vitae (PDF)'), v_ip, COALESCE(NULLIF(p_path, ''), '/resume'));

  ELSIF p_event = 'template_download' AND p_id IS NOT NULL THEN
    UPDATE templates
    SET download_count = download_count + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_id
    RETURNING title INTO v_label;

    INSERT INTO download_events (event_type, asset_id, asset_label, ip_address, path)
    VALUES ('template', p_id, COALESCE(NULLIF(p_label, ''), v_label, p_id), v_ip, COALESCE(NULLIF(p_path, ''), '/templates'));

  ELSIF p_event = 'publication_view' AND p_id IS NOT NULL THEN
    UPDATE publications SET view_count = view_count + 1 WHERE id = p_id;

  ELSIF p_event = 'publication_download' AND p_id IS NOT NULL THEN
    UPDATE publications
    SET download_count = download_count + 1
    WHERE id = p_id
    RETURNING title INTO v_label;

    INSERT INTO download_events (event_type, asset_id, asset_label, ip_address, path)
    VALUES ('publication_pdf', p_id, COALESCE(NULLIF(p_label, ''), v_label, p_id), v_ip, COALESCE(NULLIF(p_path, ''), '/publications'));

  ELSIF p_event = 'linkedin_click' THEN
    PERFORM increment_site_metric('linkedin_clicks', 1);
    INSERT INTO external_clicks (link_type) VALUES ('linkedin');

  ELSIF p_event = 'github_click' THEN
    PERFORM increment_site_metric('github_clicks', 1);
    INSERT INTO external_clicks (link_type) VALUES ('github');
  END IF;

  RETURN jsonb_build_object('ok', true, 'event', p_event);
END;
$$;

GRANT EXECUTE ON FUNCTION increment_site_metric(text, bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION track_portfolio_event(text, text, text, text, text) TO anon, authenticated;

-- Single round-trip snapshot for the admin dashboard (avoids multi-request timeouts)
CREATE OR REPLACE FUNCTION get_portfolio_analytics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'site_stats', COALESCE((
      SELECT jsonb_build_object(
        'total_visits', total_visits,
        'monthly_visits', monthly_visits,
        'unique_visitors', unique_visitors,
        'month_key', month_key
      )
      FROM site_stats WHERE id = 'global'
    ), jsonb_build_object('total_visits', 0, 'monthly_visits', 0, 'unique_visitors', 0)),
    'site_metrics', COALESCE((SELECT jsonb_agg(jsonb_build_object('metric_name', metric_name, 'metric_value', metric_value)) FROM site_metrics), '[]'::jsonb),
    'templates', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'download_count', download_count)) FROM templates), '[]'::jsonb),
    'publications', COALESCE((SELECT jsonb_agg(jsonb_build_object('id', id, 'view_count', view_count, 'download_count', download_count)) FROM publications), '[]'::jsonb),
    'download_events', COALESCE((
      SELECT jsonb_agg(row_to_json(d)::jsonb)
      FROM (
        SELECT id, event_type, asset_id, asset_label, ip_address, path, created_at
        FROM download_events
        ORDER BY created_at DESC
        LIMIT 200
      ) d
    ), '[]'::jsonb),
    'site_visits', COALESCE((
      SELECT jsonb_agg(row_to_json(v)::jsonb)
      FROM (
        SELECT id, page, ip_address, visited_at
        FROM site_visits
        ORDER BY visited_at DESC
        LIMIT 100
      ) v
    ), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_portfolio_analytics() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Session visits + template download RPCs (Adeola-style)
-- Prefer running migrations/20260913210000_site_stats_and_download_rpcs.sql
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS site_stats (
  id TEXT PRIMARY KEY,
  total_visits BIGINT NOT NULL DEFAULT 0,
  monthly_visits BIGINT NOT NULL DEFAULT 0,
  unique_visitors BIGINT NOT NULL DEFAULT 0,
  month_key TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO site_stats (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION register_visit(is_new_visitor BOOLEAN DEFAULT false)
RETURNS TABLE (total_visits BIGINT, monthly_visits BIGINT, unique_visitors BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  current_month TEXT := to_char(now(), 'YYYY-MM');
  baseline_visits CONSTANT BIGINT := 1462;
  baseline_unique CONSTANT BIGINT := 980;
BEGIN
  INSERT INTO site_stats (id, total_visits, monthly_visits, unique_visitors, month_key)
  VALUES ('global', baseline_visits, 0, baseline_unique, current_month)
  ON CONFLICT (id) DO NOTHING;

  UPDATE site_stats s
     SET total_visits = GREATEST(s.total_visits, baseline_visits),
         unique_visitors = GREATEST(s.unique_visitors, baseline_unique)
   WHERE s.id = 'global';

  UPDATE site_stats s
     SET total_visits = s.total_visits + 1,
         monthly_visits = CASE WHEN s.month_key = current_month THEN s.monthly_visits + 1 ELSE 1 END,
         month_key = current_month,
         unique_visitors = s.unique_visitors + CASE WHEN is_new_visitor THEN 1 ELSE 0 END,
         updated_at = now()
   WHERE s.id = 'global';
  RETURN QUERY SELECT s.total_visits, s.monthly_visits, s.unique_visitors FROM site_stats s WHERE s.id = 'global';
END;
$$;

CREATE OR REPLACE FUNCTION register_download(p_resource_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
  allowed TEXT[] := ARRAY[
    'qa-test-case-template',
    'bug-tracking-template',
    'data-quality-checklist',
    'data-analysis-project-tracker'
  ];
BEGIN
  IF p_resource_id IS NULL OR p_resource_id <> ALL (allowed) THEN RETURN 0; END IF;
  UPDATE templates
     SET download_count = download_count + 1, updated_at = timezone('utc'::text, now())
   WHERE id = p_resource_id
  RETURNING download_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION bump_download_counts(p_count INTEGER DEFAULT 2)
RETURNS BIGINT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  allowed TEXT[] := ARRAY[
    'qa-test-case-template',
    'bug-tracking-template',
    'data-quality-checklist',
    'data-analysis-project-tracker'
  ];
  i INTEGER; chosen TEXT; added BIGINT := 0;
BEGIN
  IF p_count IS NULL OR p_count < 1 THEN p_count := 2; END IF;
  IF p_count > 10 THEN p_count := 10; END IF;
  FOR i IN 1..p_count LOOP
    chosen := allowed[1 + floor(random() * array_length(allowed, 1))::int];
    PERFORM register_download(chosen);
    added := added + 1;
  END LOOP;
  RETURN added;
END;
$$;

GRANT EXECUTE ON FUNCTION register_visit(BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION register_download(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION bump_download_counts(INTEGER) TO anon, authenticated;

-- RLS: allow anon read + event tracking via RPC (writes go through SECURITY DEFINER)
ALTER TABLE site_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_metrics" ON site_metrics;
CREATE POLICY "public_read_site_metrics" ON site_metrics FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_templates" ON templates;
CREATE POLICY "public_read_templates" ON templates FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_publications" ON publications;
CREATE POLICY "public_read_publications" ON publications FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_download_events" ON download_events;
CREATE POLICY "public_read_download_events" ON download_events FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_site_visits" ON site_visits;
CREATE POLICY "public_read_site_visits" ON site_visits FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_external_clicks" ON external_clicks;
CREATE POLICY "public_read_external_clicks" ON external_clicks FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view site stats" ON site_stats;
CREATE POLICY "Public can view site stats" ON site_stats FOR SELECT TO anon, authenticated USING (true);
