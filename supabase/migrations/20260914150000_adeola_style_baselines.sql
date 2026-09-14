-- Adeola-style: keep seeded baseline visit/download floors, then increment from there.
-- Safe to re-run. Does not lower any existing counts.

-- 1) Ensure site_stats sits at least at portfolio baselines
INSERT INTO public.site_stats (id, total_visits, monthly_visits, unique_visitors, month_key)
VALUES ('global', 1462, 48, 980, to_char(now(), 'YYYY-MM'))
ON CONFLICT (id) DO UPDATE
SET
  total_visits = GREATEST(public.site_stats.total_visits, EXCLUDED.total_visits),
  unique_visitors = GREATEST(public.site_stats.unique_visitors, EXCLUDED.unique_visitors),
  monthly_visits = CASE
    WHEN public.site_stats.month_key = to_char(now(), 'YYYY-MM')
      THEN GREATEST(public.site_stats.monthly_visits, EXCLUDED.monthly_visits)
    ELSE GREATEST(public.site_stats.monthly_visits, EXCLUDED.monthly_visits)
  END,
  updated_at = now();

-- Keep legacy site_metrics in sync with the floor
INSERT INTO public.site_metrics (metric_name, metric_value)
VALUES ('website_visits', 1462), ('unique_visitors', 980)
ON CONFLICT (metric_name) DO UPDATE
SET metric_value = GREATEST(public.site_metrics.metric_value, EXCLUDED.metric_value),
    updated_at = timezone('utc'::text, now());

-- 2) Template download floors (portfolio.json baselines)
UPDATE public.templates SET download_count = GREATEST(download_count, 188), updated_at = timezone('utc'::text, now())
 WHERE id = 'qa-test-case-template';
UPDATE public.templates SET download_count = GREATEST(download_count, 146), updated_at = timezone('utc'::text, now())
 WHERE id = 'bug-tracking-template';
UPDATE public.templates SET download_count = GREATEST(download_count, 223), updated_at = timezone('utc'::text, now())
 WHERE id = 'data-quality-checklist';
UPDATE public.templates SET download_count = GREATEST(download_count, 167), updated_at = timezone('utc'::text, now())
 WHERE id = 'data-analysis-project-tracker';

-- 3) Publication view floors
UPDATE public.publications SET view_count = GREATEST(view_count, 328) WHERE id = 'pub-1';
UPDATE public.publications SET view_count = GREATEST(view_count, 215) WHERE id = 'pub-2';
UPDATE public.publications SET view_count = GREATEST(view_count, 180) WHERE id = 'pub-3';

-- 4) register_visit: never restart from 0/1 — raise to baseline first, then +1
CREATE OR REPLACE FUNCTION public.register_visit(is_new_visitor BOOLEAN DEFAULT false)
RETURNS TABLE (total_visits BIGINT, monthly_visits BIGINT, unique_visitors BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month TEXT := to_char(now(), 'YYYY-MM');
  baseline_visits CONSTANT BIGINT := 1462;
  baseline_unique CONSTANT BIGINT := 980;
BEGIN
  INSERT INTO public.site_stats (id, total_visits, monthly_visits, unique_visitors, month_key)
  VALUES ('global', baseline_visits, 0, baseline_unique, current_month)
  ON CONFLICT (id) DO NOTHING;

  -- Raise floors if someone reset the row
  UPDATE public.site_stats s
     SET total_visits = GREATEST(s.total_visits, baseline_visits),
         unique_visitors = GREATEST(s.unique_visitors, baseline_unique)
   WHERE s.id = 'global';

  UPDATE public.site_stats s
     SET total_visits = s.total_visits + 1,
         monthly_visits = CASE WHEN s.month_key = current_month THEN s.monthly_visits + 1 ELSE 1 END,
         month_key = current_month,
         unique_visitors = s.unique_visitors + CASE WHEN is_new_visitor THEN 1 ELSE 0 END,
         updated_at = now()
   WHERE s.id = 'global';

  -- Mirror into legacy site_metrics for older admin counters
  INSERT INTO public.site_metrics (metric_name, metric_value)
  SELECT 'website_visits', s.total_visits FROM public.site_stats s WHERE s.id = 'global'
  ON CONFLICT (metric_name) DO UPDATE
  SET metric_value = EXCLUDED.metric_value,
      updated_at = timezone('utc'::text, now());

  INSERT INTO public.site_metrics (metric_name, metric_value)
  SELECT 'unique_visitors', s.unique_visitors FROM public.site_stats s WHERE s.id = 'global'
  ON CONFLICT (metric_name) DO UPDATE
  SET metric_value = EXCLUDED.metric_value,
      updated_at = timezone('utc'::text, now());

  RETURN QUERY
    SELECT s.total_visits, s.monthly_visits, s.unique_visitors
      FROM public.site_stats s WHERE s.id = 'global';
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_visit(BOOLEAN) TO anon, authenticated;

-- 5) Optional light visit drip (Adeola-style growth without waiting only on real traffic)
CREATE OR REPLACE FUNCTION public.bump_visit_counts(p_count INTEGER DEFAULT 1)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i INTEGER;
  added BIGINT := 0;
BEGIN
  IF p_count IS NULL OR p_count < 1 THEN
    p_count := 1;
  END IF;
  IF p_count > 5 THEN
    p_count := 5;
  END IF;

  FOR i IN 1..p_count LOOP
    PERFORM public.register_visit(false);
    added := added + 1;
  END LOOP;

  RETURN added;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bump_visit_counts(INTEGER) TO anon, authenticated;
