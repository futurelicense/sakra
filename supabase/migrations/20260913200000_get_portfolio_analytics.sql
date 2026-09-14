-- Run once in Supabase SQL Editor if admin still times out on multi-query loads.
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
