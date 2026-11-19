-- SwiftDictionary Update 2.6.0 — least-privilege defaults and Daily Learning sessions.
-- Applied and validated on the isolated Singapore staging project.
-- Keep production untouched until the owner approves the production rollout.

-- Match the intended client access for Daily Learning session rows:
-- authenticated users can read/start/update their own rows through RLS;
-- they cannot directly delete rows. Anonymous users have no table privileges.
REVOKE ALL PRIVILEGES ON TABLE public.daily_activity_sessions FROM anon;
REVOKE DELETE ON TABLE public.daily_activity_sessions FROM authenticated;

-- Stop future objects created by postgres migrations from automatically
-- inheriting Data API CRUD access. Each migration must explicitly grant the
-- exact table operations required by the client.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;

-- Keep the sequence UPDATE privilege (Postgres nextval support) but remove
-- API-role USAGE/SELECT defaults. Grant exact sequence access only if needed.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE USAGE, SELECT ON SEQUENCES FROM anon, authenticated;

-- PostgreSQL grants EXECUTE to PUBLIC by default. This global revoke is
-- intentionally not schema-scoped; the public-schema revoke alone would not
-- remove the global PUBLIC default. New RPCs must explicitly grant EXECUTE.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- These are trigger-only guards, not client-callable RPC endpoints.
REVOKE ALL PRIVILEGES ON FUNCTION public.guard_daily_activity_session_update()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION public.guard_lesson_progress_update()
  FROM PUBLIC, anon, authenticated;
