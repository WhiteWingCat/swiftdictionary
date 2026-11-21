-- Synthetic production-shaped ACL drift, applied AFTER the existing
-- U2.6.0 staging ACL migrations and their staging regression assertions.
-- All grants are disposable local-only test fixtures.

GRANT ALL PRIVILEGES ON TABLE public.daily_activity_sessions TO anon, authenticated;
GRANT ALL PRIVILEGES ON SEQUENCE public.daily_activity_sessions_id_seq TO authenticated;

-- Reproduce production's anonymous plan-limit SELECT grant.
GRANT SELECT ON TABLE public.learning_plan_limits TO anon;

-- Reproduce anonymous access on the three identity sequences before hardening.
GRANT USAGE, SELECT, UPDATE ON SEQUENCE
  public.learning_activity_log_id_seq,
  public.lesson_progress_id_seq,
  public.lesson_practice_results_id_seq
TO anon;

GRANT EXECUTE ON FUNCTION public.guard_daily_activity_session_update()
TO PUBLIC, anon, authenticated;
