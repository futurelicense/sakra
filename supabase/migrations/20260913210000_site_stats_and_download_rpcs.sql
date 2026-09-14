-- Adeola-style visit sessions + template download RPCs (+ hourly drip helper).
-- Run in the Supabase SQL editor after prior migrations.

CREATE TABLE IF NOT EXISTS public.site_stats (
  id TEXT PRIMARY KEY,
  total_visits BIGINT NOT NULL DEFAULT 0,
  monthly_visits BIGINT NOT NULL DEFAULT 0,
  unique_visitors BIGINT NOT NULL DEFAULT 0,
  month_key TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view site stats" ON public.site_stats;
CREATE POLICY "Public can view site stats" ON public.site_stats
  FOR SELECT TO anon, authenticated USING (true);

-- Seed from legacy site_metrics when present
INSERT INTO public.site_stats (id, total_visits, monthly_visits, unique_visitors, month_key)
SELECT
  'global',
  COALESCE((SELECT metric_value FROM public.site_metrics WHERE metric_name = 'website_visits'), 0),
  0,
  COALESCE((SELECT metric_value FROM public.site_metrics WHERE metric_name = 'unique_visitors'), 0),
  to_char(now(), 'YYYY-MM')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.register_visit(is_new_visitor BOOLEAN DEFAULT false)
RETURNS TABLE (total_visits BIGINT, monthly_visits BIGINT, unique_visitors BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month TEXT := to_char(now(), 'YYYY-MM');
BEGIN
  INSERT INTO public.site_stats (id) VALUES ('global')
  ON CONFLICT (id) DO NOTHING;

  UPDATE public.site_stats s
     SET total_visits = s.total_visits + 1,
         monthly_visits = CASE WHEN s.month_key = current_month THEN s.monthly_visits + 1 ELSE 1 END,
         month_key = current_month,
         unique_visitors = s.unique_visitors + CASE WHEN is_new_visitor THEN 1 ELSE 0 END,
         updated_at = now()
   WHERE s.id = 'global';

  RETURN QUERY
    SELECT s.total_visits, s.monthly_visits, s.unique_visitors
      FROM public.site_stats s WHERE s.id = 'global';
END;
$$;
GRANT EXECUTE ON FUNCTION public.register_visit(BOOLEAN) TO anon, authenticated;

-- Real + drip downloads against the existing templates table (four Sakera IDs).
CREATE OR REPLACE FUNCTION public.register_download(p_resource_id TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  IF p_resource_id IS NULL OR p_resource_id <> ALL (allowed) THEN
    RETURN 0;
  END IF;

  UPDATE public.templates
     SET download_count = download_count + 1,
         updated_at = timezone('utc'::text, now())
   WHERE id = p_resource_id
  RETURNING download_count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;
GRANT EXECUTE ON FUNCTION public.register_download(TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.bump_download_counts(p_count INTEGER DEFAULT 2)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed TEXT[] := ARRAY[
    'qa-test-case-template',
    'bug-tracking-template',
    'data-quality-checklist',
    'data-analysis-project-tracker'
  ];
  i INTEGER;
  chosen TEXT;
  added BIGINT := 0;
BEGIN
  IF p_count IS NULL OR p_count < 1 THEN
    p_count := 2;
  END IF;
  IF p_count > 10 THEN
    p_count := 10;
  END IF;

  FOR i IN 1..p_count LOOP
    chosen := allowed[1 + floor(random() * array_length(allowed, 1))::int];
    PERFORM public.register_download(chosen);
    added := added + 1;
  END LOOP;

  RETURN added;
END;
$$;
GRANT EXECUTE ON FUNCTION public.bump_download_counts(INTEGER) TO anon, authenticated;

-- Refresh admin snapshot RPC to include site_stats
CREATE OR REPLACE FUNCTION public.get_portfolio_analytics()
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
      FROM public.site_stats WHERE id = 'global'
    ), jsonb_build_object('total_visits', 0, 'monthly_visits', 0, 'unique_visitors', 0, 'month_key', to_char(now(), 'YYYY-MM'))),
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

GRANT EXECUTE ON FUNCTION public.get_portfolio_analytics() TO anon, authenticated;
